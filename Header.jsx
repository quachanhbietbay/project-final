// src/components/Header.jsx
import { ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import TokenDisplay from './TokenDisplay';
import { useState, useContext } from 'react';
import { useCart } from './CartContext';
import { AuthContext } from './AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-pink-600">
        <Link to="/">My Shop</Link>
      </div>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        className="border px-4 py-2 rounded-md w-1/3 focus:outline-pink-400"
      />

      {/* Navigation */}
      <nav className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/login" className="text-pink-600 hover:underline">
              Đăng nhập
            </Link>
            <Link to="/register" className="text-pink-600 hover:underline">
              Đăng ký
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {/* Dropdown tên user */}
            <div className="relative">
              <button
                className="text-pink-600 hover:underline"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.name}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Icon giỏ hàng */}
      <div className="flex items-center gap-4">
        {/* Legacy discount token removed */}
        <Link to="/cart" className="relative text-gray-600 hover:text-pink-600">
          <ShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
