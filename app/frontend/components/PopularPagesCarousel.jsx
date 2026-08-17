// components/PopularPagesCarousel.jsx
import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const PopularPagesCarousel = () => {
  const popularPages = [
    {
      id: 1,
      title: "Download our catalogue & magazines",
      image: "/populerpages/image1.png",
      href: "/frontend/catalogues-and-folders",
    },
    {
      id: 2,
      title: "SALE",
      image: "/populerpages/image4.png",
      href: "/frontend/all-products",
    },
    {
      id: 3,
      title: "FROZEN PRODUCTS",
      image: "/populerpages/image3.png",
      href: "/frontend/frozen-products",
    },
    {
      id: 4,
      title: "Vegan selection",
      image: "/populerpages/image2.png",
      href: "/frontend/vegan-products",
    },
    
  ];

  return (
    <section className="bg-[url('/home/bg-1.svg')] bg-cover py-24  mt-[-47px] relative overflow-hidden">
      {/* Dark Overlay for better readability */}
      <div className="absolute inset-0 "></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Popular Pages
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Handpicked destinations within our product universe
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {popularPages.map((page) => (
            <Link
              key={page.id}
              href={page.href}
              className="group relative bg-white rounded-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-white/20"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={page.image}
                  alt={page.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                
                {/* Hover Effect Indicator */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              </div>

              {/* Content - No overlay, content stays below image */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-800 leading-tight group-hover:text-green-500 transition-colors duration-300 flex-1">
                    {page.title}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 group-hover:bg-green-700 p-3 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg">
                      <ChevronRightIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Animated border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/all-pages"
            className="inline-flex items-center gap-3 bg-white/90 hover:bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/30"
          >
            <span>View All Pages</span>
            <ChevronRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPagesCarousel;