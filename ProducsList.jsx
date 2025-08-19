import { Link } from "react-router-dom";
import ProductCard from "./Products"; 
import axios from "../api/axios";
import { useEffect, useState, useMemo } from "react";

// const products = [
//   {
//     id: 1,
//     name: "Đồng Hồ Gucci",
//     price: 120000000,
//     image: "https://bizweb.dktcdn.net/100/175/988/products/wro16ms27rb21aa-1-copy.jpg?v=1722223341387"
//   },
//   {
//     id: 2,
//     name: "Ví Louis Vuitton",
//     price: 18000000,
//     image: "https://product.hstatic.net/1000387228/product/louis-vuitton-m61695-1_d9938aca43c24ac9a86a147f827229b3_master.jpg"
//   },
//   {
//     id: 3,
//     name: "Thảm Lót Chuột",
//     price: 600000,
//     image: "https://www.phongcachxanh.vn/cdn/shop/products/lot-chu-t-pulsar-paraspeed-v2-high-speed-xl-d-n-xxl-37248464322805.jpg?v=1677146058&width=600"
//   },
 
// ];

function ProductList() {
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
      const load = async () => {
        try {
          const res = await axios.get("/api/products");
          setAllProducts(res.data);
        } catch (_) {}
      };
      load();
    }, []);

    // Lấy 3 sản phẩm đầu làm nổi bật
    const products = allProducts.slice(0, 3);
  
    return (
      <section className="my-10">
        {/* Header với nút Xem tất cả */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Xem tất cả →
          </Link>
        </div>
  
        {/* Danh sách 3 sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>
    );
  }
  
  export default ProductList;
