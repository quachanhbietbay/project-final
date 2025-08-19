import { useState } from "react";
import AddProductForm from "./AddProductForm";
import UserList from "./UserList";
import ManageCoupons from "./ManageCoupons";

function AdminPanel() {
  const [tab, setTab] = useState("addProduct");

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === "addProduct" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("addProduct")}
        >
          Thêm sản phẩm
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "users" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("users")}
        >
          Danh sách người dùng
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "coupons" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("coupons")}
        >
          Mã giảm giá
        </button>
      </div>
      {tab === "addProduct" && <AddProductForm />}
      {tab === "users" && <UserList />}
      {tab === "coupons" && <ManageCoupons />}
    </div>
  );
}

export default AdminPanel;