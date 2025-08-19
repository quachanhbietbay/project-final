import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/Products.jsx"
import { useEffect, useMemo, useState } from "react";
import axios from "../api/axios";
import { useCart } from "./CartContext.jsx";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id } = useParams();
  const [serverProducts, setServerProducts] = useState([]);
  const [mockProducts, setMockProducts] = useState([]);
  useEffect(() => {
    axios.get("/api/products").then(res => setServerProducts(res.data)).catch(()=>{});
    import("../components/data/Products.jsx").then(m => setMockProducts(m.allProducts));
  }, []);
  const all = useMemo(() => [...serverProducts, ...mockProducts], [serverProducts, mockProducts]);
  const product = useMemo(() => all.find((p) => String(p.id || p._id) === String(id)), [all, id]);
  const [quantity, setQuantity] = useState(1);
  const {addToCart} = useCart();

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại</h2>
        <Link to="/products" className="text-blue-500 hover:underline">
          ← Quay lại trang sản phẩm
        </Link>
      </div>
    );
  }

  // Sản phẩm liên quan (ví dụ: cùng category, nếu không có thì random)
  const relatedProducts = all.filter((p) => String(p.id || p._id) !== String(product.id || product._id)).slice(0,4);

  
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Link to="/products" className="text-sm text-gray-600 hover:underline">
          ← Quay lại tất cả sản phẩm
        </Link>
  
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
  
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-2xl text-pink-600 font-semibold mb-4">
              {product.price.toLocaleString()} đ
            </p>
            <p className="text-gray-700 mb-6">
              {product.description || "Mô tả sản phẩm đang được cập nhật..."}
            </p>
  
            <div className="flex items-center gap-3 mb-6">
              <label htmlFor="qty" className="font-medium">
                Số lượng:
              </label>
              <input
                id="qty"
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 border rounded-md text-center"
              />
            </div>
  
            <button 
              className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 transition"
              onClick={() =>{
               addToCart({ ...product, id: product.id || product._id }, quantity)
               toast.success("Đã thêm sản phẩm vào giỏ hàng!");
              } }// ⬅ Thêm vào giỏ
                
            >
              
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
  
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default ProductDetail;