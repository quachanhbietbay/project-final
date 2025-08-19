import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) {
      axios.get("/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Không tải được lịch sử đơn hàng");
      });
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Thông tin cá nhân */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
        <p><strong>Tên:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {/* Legacy discount UI removed */}
      </div>

      {/* Lịch sử mua hàng */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Lịch sử mua hàng</h3>
        {orders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : (
          orders.map(o => {
            const items = o.orderItems || o.cartItems || [];
            return (
              <div key={o._id} className="border p-4 rounded mb-4">
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold mb-2">Đơn hàng</div>
                    <div className="flex flex-wrap gap-3">
                      {items.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {i.image && (
                            <img src={i.image} alt={i.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="text-sm">
                            <div>{i.name}</div>
                            <div className="text-gray-500">SL: {i.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right min-w-[140px]">
                    <p className="font-bold text-pink-600">{o.totalPrice.toLocaleString()} đ</p>
                    <span className="text-sm">{o.status}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
