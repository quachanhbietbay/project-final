// src/components/CheckoutPage.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { useCart } from "./CartContext"; // 
import { useNavigate } from "react-router-dom";
import BankTransferQR from "./BankTransferQR";

export default function CheckoutPage() {
  const { token,user, login } = useContext(AuthContext);
  const { cart, setCart } = useCart();  
  const { clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();


  const discountAmount = couponResult?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
    setSubtotal(sum);
  }, [cart]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponResult(null);
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    setValidatingCoupon(true);
    try {
      const res = await axios.post("/api/coupons/validate", { code: couponCode.trim(), cartItems: cart });
      setCouponResult(res.data);
      toast.success(`Áp dụng mã ${res.data.code} (-${res.data.percent}%)`);
    } catch (err) {
      setCouponResult(null);
      toast.error(err.response?.data?.message || "Mã giảm giá không hợp lệ");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
      return;
    }
    if (!cart.length) {
      toast.error("Giỏ hàng trống");
      return;
    }
    if (!token) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/orders",
        { cartItems: cart, address, paymentMethod, totalPrice: subtotal, couponCode: couponResult?.code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Đặt hàng thành công!");
      clearCart();
      try {
        const me = await axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        login(token, me.data.user);
      } catch (_) {}

      if (paymentMethod === "bank") {
        setCreatedOrder(res.data);
        setShowQR(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi khi đặt hàng");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Thanh toán</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Cart items */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-3">Sản phẩm</h3>

          {cart.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng trống</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id || item._id}
                  className="flex items-center gap-4 border p-3 rounded"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-pink-600">
                      {(item.price || 0).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Checkout form */}
        <div className="p-4 border rounded">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Địa chỉ giao hàng
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, đường, quận, thành phố"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Phương thức thanh toán
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="bank">Chuyển khoản ngân hàng</option>
            </select>
          </div>

          <div className="mb-2">
            <div className="text-sm text-gray-600">Tổng tạm tính</div>
            <div className="text-lg font-semibold text-gray-800">
              {subtotal.toLocaleString("vi-VN")} đ
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Mã giảm giá</label>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Nhập mã (vd: SALE10)"
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleValidateCoupon}
                disabled={validatingCoupon || !couponCode.trim()}
                className={`px-4 py-2 rounded text-white ${validatingCoupon ? "bg-gray-400" : "bg-pink-600 hover:bg-pink-700"}`}
              >
                {validatingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
              </button>
            </div>
            {couponResult && (
              <div className="mt-2 text-sm text-green-600">
                Đã áp dụng mã {couponResult.code} (-{couponResult.percent}%): -{(couponResult.discountAmount || 0).toLocaleString("vi-VN")} đ
              </div>
            )}
          </div>

          { (couponResult?.discountAmount || 0) > 0 && (
            <div className="mb-2">
              <div className="text-sm text-gray-600">Giảm giá</div>
              <div className="text-lg font-semibold text-green-600">- {(couponResult.discountAmount || 0).toLocaleString("vi-VN")} đ</div>
            </div>
          )}

          <div className="mb-4">
            <div className="text-sm text-gray-600">Tổng thanh toán</div>
            <div className="text-xl font-bold text-pink-600">
              {finalTotal.toLocaleString("vi-VN")} đ
            </div>
          </div>

          {paymentMethod === "bank" && showQR && createdOrder && (
            <BankTransferQR
              amount={createdOrder.totalPrice}
              memo={`DH-${createdOrder._id}`}
              bankCode="VCB"
              accountNo="0123456789"
              accountName="khanh"
            />
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading || (paymentMethod === "bank" && showQR)}
            className={`w-full py-2 rounded text-white ${
              loading
                ? "bg-gray-400"
                : "bg-pink-600 hover:bg-pink-700 transition"
            }`}
          >
            {loading
              ? "Đang xử lý..."
              : paymentMethod === "bank" && showQR
              ? "Đã tạo đơn - Quét QR để thanh toán"
              : paymentMethod === "bank"
              ? "Tạo đơn & hiển thị QR"
              : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}
