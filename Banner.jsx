import { Link } from "react-router-dom";

function HeroBanner() {
    return (
      <section className="bg-gradient-to-r from-pink-100 to-pink-300 py-12 px-6 rounded-xl shadow-md mt-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-pink-800 mb-4">Welcome to MyShop!</h1>
          <p className="text-lg text-pink-700 mb-6">
            Discover the best products with great deals and fast delivery!
          </p>
          <Link to="/products">
            <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </section>
    )
  }
  
  export default HeroBanner;
  