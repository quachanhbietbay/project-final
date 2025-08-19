import { useCart } from "../components/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Giỏ hàng trống</h2>
        <Link to="/products" className="text-blue-500 hover:underline">
          ← Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h2 className="font-bold">{item.name}</h2>
              <p className="text-pink-600">
                {item.price.toLocaleString()} đ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1 border rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 border rounded"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:underline ml-4"
            >
              Xoá
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Tổng: {totalPrice.toLocaleString()} đ
        </h2>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Xoá tất cả
          </button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded">
            <Link to="/checkout">
              Thanh toán
            </Link>
          </button>

          <button>
            <Link to='/products' className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Tiếp tục mua sắm
            </Link>
          </button>

        </div>
      </div>
    </div>
  );
}
