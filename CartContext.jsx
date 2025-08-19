// src/components/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Lấy giỏ hàng từ localStorage khi load trang
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
      setCart([]);
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
    }
  }, [cart]);

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id || item._id === product._id
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id || item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        { ...product, quantity, id: product.id || product._id }
      ];
    });
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id && item._id !== id)
    );
  };

  // Cập nhật số lượng
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id || item._id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
