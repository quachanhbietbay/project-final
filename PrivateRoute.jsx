import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useContext(AuthContext);

  // Khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Đang tải...
      </div>
    );
  }

  // Nếu chưa đăng nhập → chuyển về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu quyền admin mà user không phải admin → chặn truy cập
  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />; // Có thể đổi thành trang báo lỗi 403
  }

  // Nếu hợp lệ → render nội dung
  return children;
}
