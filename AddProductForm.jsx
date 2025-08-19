import { useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

function AddProductForm() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", price: "", image: "", description: "" });
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (_) {}
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", { ...form, price: Number(form.price) }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Đã thêm sản phẩm");
      setForm({ name: "", price: "", image: "", description: "" });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên sản phẩm"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Giá"
        type="number"
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Mô tả"
        className="w-full border p-2 rounded"
      />
      <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Link ảnh"
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
        Thêm sản phẩm
      </button>

      {/* List & delete */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Danh sách sản phẩm</h3>
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p._id} className="flex items-center justify-between border p-2 rounded">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">{(p.price||0).toLocaleString('vi-VN')} đ</div>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(`/api/products/${p._id}`, { headers: { Authorization: `Bearer ${token}` } });
                    toast.success("Đã xóa");
                    fetchProducts();
                  } catch (_) {
                    toast.error("Xóa thất bại");
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}

export default AddProductForm;