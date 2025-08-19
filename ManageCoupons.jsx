import { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export default function ManageCoupons() {
  const { token } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    code: "",
    percent: 10,
    appliesTo: "all",
    eligibleProductIds: "",
    endDate: "",
    maxUses: 0,
    isActive: true,
  });

  const load = () => {
    axios
      .get("/api/coupons", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setList(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    axios.get("/api/products")
      .then((res) => setProducts(res.data || []))
      .catch(() => {});
  }, [token]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      code: String(form.code || "").toUpperCase().trim(),
      percent: Number(form.percent) || 0,
      appliesTo: form.appliesTo,
      // NOTE: split only by comma so names with spaces are preserved
      eligibleProductIds: form.appliesTo === "includeList" && form.eligibleProductIds
        ? form.eligibleProductIds.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      endDate: form.endDate || undefined,
      maxUses: Number(form.maxUses) || 0,
      isActive: Boolean(form.isActive),
    };
    axios
      .post("/api/coupons", payload, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success("Đã lưu mã giảm giá");
        setForm({ code: "", percent: 10, appliesTo: "all", eligibleProductIds: "", endDate: "", maxUses: 0, isActive: true });
        load();
      })
      .catch((e) => toast.error(e?.response?.data?.message || "Lỗi"));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Quản lý mã giảm giá</h3>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-sm mb-1">Code</label>
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border px-3 py-2 rounded" placeholder="SALE10" />
        </div>
        <div>
          <label className="block text-sm mb-1">Phần trăm (%)</label>
          <input type="number" min={1} max={100} value={form.percent} onChange={(e) => setForm({ ...form, percent: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Phạm vi áp dụng</label>
          <select value={form.appliesTo} onChange={(e) => setForm({ ...form, appliesTo: e.target.value })} className="w-full border px-3 py-2 rounded">
            <option value="all">Tất cả sản phẩm</option>
            <option value="includeList">Chỉ danh sách sản phẩm</option>
          </select>
        </div>
        {form.appliesTo === "includeList" && (
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Danh sách Product IDs hoặc tên (ngăn cách bằng dấu phẩy). Ví dụ: iPhone 15, Galaxy S24</label>
            <input value={form.eligibleProductIds} onChange={(e) => setForm({ ...form, eligibleProductIds: e.target.value })} className="w-full border px-3 py-2 rounded" placeholder="65f...abc, 65f...def hoặc iPhone 15, Galaxy S24" />
            <div className="mt-3 max-h-56 overflow-auto border rounded p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {products.map((p) => {
                const checked = String(form.eligibleProductIds).includes(p._id) || String(form.eligibleProductIds).toLowerCase().includes((p.name || "").toLowerCase());
                return (
                  <label key={p._id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = String(form.eligibleProductIds || "");
                        const tokens = current ? current.split(",").map((t) => t.trim()).filter(Boolean) : [];
                        const candidate = p._id; // prefer stable id token
                        const has = tokens.includes(candidate);
                        const next = has ? tokens.filter((t) => t !== candidate) : [...tokens, candidate];
                        setForm({ ...form, eligibleProductIds: next.join(", ") });
                      }}
                    />
                    <span className="truncate">{p.name} <span className="text-gray-400">({p._id})</span></span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm mb-1">Hạn dùng (optional)</label>
          <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Giới hạn lượt dùng (0 = không giới hạn)</label>
          <input type="number" min={0} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          <label htmlFor="active">Kích hoạt</label>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded">Lưu</button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">%</th>
              <th className="border px-2 py-1">Phạm vi</th>
              <th className="border px-2 py-1">Hết hạn</th>
              <th className="border px-2 py-1">Max</th>
              <th className="border px-2 py-1">Đã dùng</th>
              <th className="border px-2 py-1">Active</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c._id}>
                <td className="border px-2 py-1">{c.code}</td>
                <td className="border px-2 py-1">{c.percent}%</td>
                <td className="border px-2 py-1">{c.appliesTo === "all" ? "Tất cả" : `Danh sách (${c.eligibleProductIds?.length || 0})`}</td>
                <td className="border px-2 py-1">{c.endDate ? new Date(c.endDate).toLocaleString() : ""}</td>
                <td className="border px-2 py-1">{c.maxUses}</td>
                <td className="border px-2 py-1">{c.usedCount}</td>
                <td className="border px-2 py-1">{c.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


