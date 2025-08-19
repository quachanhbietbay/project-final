import React, { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      // login(res.data.token, res.data.user);
      toast.success('Đăng ký thành công')
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">Đăng ký</h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Tên</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Nhập tên"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Nhập email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded transition duration-200"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
