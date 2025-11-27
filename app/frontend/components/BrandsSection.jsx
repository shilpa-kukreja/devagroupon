import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Nutri snack",
    logo: "/brand/miyamoto.webp",
    category: "Snacks",
  },
  {
    name: "Samyang",
    logo: "/brand/Samyang.webp",
    category: "Noodles",
  },
  {
    name: "Crying Thaiger",
    logo: "/brand/vitamizu.webp",
    category: "Sauces",
  },
  {
    name: "ABC",
    logo: "/brand/abc.webp",
    category: "Seasonings",
  },
  {
    name: "Hata Kosen",
    logo: "/brand/Darda.webp",
    category: "Seafood",
  },
  {
    name: "Pantai",
    logo: "/brand/oppa.webp",
    category: "Ingredients",
  },
];

const BrandsSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-50 rounded-full -translate-x-36 -translate-y-36 opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full translate-x-48 translate-y-48 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              TRUSTED PARTNERS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="text-green-600">Brands</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover premium quality brands from across Asia, carefully curated for European markets
            </p>
          </div>
          
          <Link 
            href="/brands"
            className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-green-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-green-200"
          >
            <span>View All Brands</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-6 border border-gray-100"
            >
              {/* Logo Container */}
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain transition-all duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Brand Name */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 group-hover:text-green-600 transition-colors duration-300">
                {brand.name}
              </h3>

              {/* Category */}
              <p className="text-sm text-gray-500 text-center font-medium">
                {brand.category}
              </p>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-all duration-300 pointer-events-none"></div>
              
              {/* Corner Accent */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        {/* <div className="text-center mt-16">
          <div className="inline-flex flex-wrap justify-center gap-8 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-gray-600 text-sm">Premium Brands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1000+</div>
              <div className="text-gray-600 text-sm">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">15+</div>
              <div className="text-gray-600 text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99%</div>
              <div className="text-gray-600 text-sm">Satisfaction</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default BrandsSection;