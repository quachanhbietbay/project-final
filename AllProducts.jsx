import ProductCard from "./Products";
import React, {useMemo,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
export default function AllProducts() {
    const [serverProducts, setServerProducts] = useState([]);
    const [mockProducts, setMockProducts] = useState([]);
    useEffect(() => {
     
      axios.get("/api/products").then(res => setServerProducts(res.data)).catch(()=>{});
    
      import("./data/Products").then(m => setMockProducts(m.allProducts));
    }, []);
    // UI state
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12); 
  
   
    const categories = useMemo(() => {
      const setC = new Set();
      const combined = [...serverProducts, ...mockProducts];
      combined.forEach((p) => {
        if (p.category) setC.add(p.category);
        else {
          
        }
      });
      return ["all", ...Array.from(setC)];
    }, []);
  
    const filtered = useMemo(() => {
      // Kết hợp sản phẩm server (admin thêm/xóa) 
      let list = [...serverProducts, ...mockProducts];
  
      // tìm kiếm
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q));
      }
  
      // filter category 
      if (category !== "all") {
        list = list.filter((p) => p.category === category);
      }
  
      // filter by price 
      if (priceRange !== "all") {
        if (priceRange === "below-500k") {
          list = list.filter((p) => p.price < 500000);
        } else if (priceRange === "500k-1.5m") {
          list = list.filter((p) => p.price >= 500000 && p.price <= 1500000);
        } else if (priceRange === "1.5m-3m") {
          list = list.filter((p) => p.price > 1500000 && p.price <= 3000000);
        } else if (priceRange === "above-3m") {
          list = list.filter((p) => p.price > 3000000);
        }
      }
  
      // sort
      if (sortBy === "price-asc") {
        list.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-desc") {
        list.sort((a, b) => b.price - a.price);
      } else if (sortBy === "name-asc") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "name-desc") {
        list.sort((a, b) => b.name.localeCompare(a.name));
      }
     
  
      return list;
    }, [query, category, priceRange, sortBy, serverProducts, mockProducts]);
  
    // ptrang
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    // ensure page in range
    if (page > totalPages) setPage(totalPages);
  
    const paginated = useMemo(() => {
      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);
  
    //render page numbers (đơn giản)
    const renderPageNumbers = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded-md border ${
              i === page ? "bg-blue-600 text-white border-blue-600" : "bg-white"
            }`}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
  
    return (
      <section className="my-10 px-4">
     
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h2>
            <p className="text-sm text-gray-500 mt-1">
              Hiện có <span className="font-medium">{filtered.length}</span> sản phẩm
            </p>
          </div>
  
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-600 hover:underline">
              ← Về trang chủ
            </Link>
          </div>
        </div>
  
        {/* Controls: search + filters + sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1); 
              }}
              placeholder="Tìm sản phẩm theo tên..."
              className="w-full md:max-w-md px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
  
        
          <div className="flex gap-3 items-center">
          
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md"
            >
           
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "Tất cả danh mục" : c}
                </option>
              ))}
            </select>
  
            
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tất cả giá</option>
              <option value="below-500k">Dưới 500k</option>
              <option value="500k-1.5m">500k - 1.5M</option>
              <option value="1.5m-3m">1.5M - 3M</option>
              <option value="above-3m">Trên 3M</option>
            </select>
  
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: tăng dần</option>
              <option value="price-desc">Giá: giảm dần</option>
              <option value="name-asc">Tên: A → Z</option>
              <option value="name-desc">Tên: Z → A</option>
            </select>
  
         
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md"
              title="Số sản phẩm trên 1 trang"
            >
              <option value={6}>6 / trang</option>
              <option value={9}>9 / trang</option>
              <option value={12}>12 / trang</option>
              <option value={18}>18 / trang</option>
            </select>
          </div>
        </div>
  
        {/* Grid products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginated.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
  
      
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-medium">
              {(page - 1) * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium">
              {Math.min(page * pageSize, filtered.length)}
            </span>{" "}
            trong <span className="font-medium">{filtered.length}</span> sản phẩm
          </div>
  
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border disabled:opacity-50"
            >
              Prev
            </button>
  
            <div className="flex gap-2 items-center">{renderPageNumbers()}</div>
  
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    );
  }
  
