"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { apiService } from "./apiService";


export default function BrandProduct({ brandSlug }) {
  const [brand, setBrand] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely extract and stringify values
  const extractValue = (item, fallback = "") => {
    if (!item) return fallback;
    
    // Handle nested objects
    if (typeof item === 'object') {
      // Return name if it exists in the object
      if (item.name) return String(item.name);
      // Return the first string value found
      const values = Object.values(item).filter(val => typeof val === 'string');
      return values.length > 0 ? String(values[0]) : fallback;
    }
    
    // Handle primitive values
    return String(item || fallback);
  };

  const extractId = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (item.$oid) return item.$oid;
    if (item._id?.$oid) return item._id.$oid;
    if (item._id) return item._id;
    if (item.id) return item.id.toString();
    return null;
  };

  // Fetch brand and products data using apiService
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all brands and find the one with matching slug
        const brands = await apiService.getBrands();
        const foundBrand = brands.find(b => b.slug === brandSlug);
        
        if (!foundBrand) {
          throw new Error("Brand not found");
        }
        
        setBrand(foundBrand);
        const brandId = extractId(foundBrand);

        // Get all products and filter by brand
        const allProducts = await apiService.getProducts();
        const filteredProducts = allProducts.filter(product => {
          if (!product.brand) return false;
          
          const productBrandId = extractId(product.brand);
          return productBrandId === brandId;
        });
        
        setBrandProducts(filteredProducts);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching brand data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (brandSlug) {
      fetchBrandData();
    }
  }, [brandSlug]);

  // Safe image URL function
  const getImageUrl = (imgPath) => {
    try {
      if (!imgPath) return "/images/placeholder-product.jpg";
      if (typeof imgPath !== 'string') return "/images/placeholder-product.jpg";
      if (imgPath.startsWith('http')) return imgPath;
      
      let cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${cleanPath}`;
      
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/images/placeholder-product.jpg";
    }
  };

  // Format price consistently
  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "N/A" : `$${numPrice.toFixed(2)}`;
  };

  // Get product display information safely
  const getProductInfo = (product) => {
    return {
      id: extractId(product),
      name: extractValue(product.name, "Unnamed Product"),
      slug: extractValue(product.slug, extractId(product)),
      image: getImageUrl(product.thumbImg || product.image || product.thumbnail),
      size: extractValue(product.ml || product.kg || product.size || product.weight, "Standard Size"),
      country: extractValue(product.country, "Global"),
      price: formatPrice(product.price),
      discountPrice: product.discountPrice ? formatPrice(product.discountPrice) : null,
      hasDiscount: !!product.discountPrice
    };
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Products</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Brand not found
  if (!brand) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Not Found</h3>
            <p className="text-gray-600 mb-6">The brand you're looking for doesn't exist.</p>
            <Link
              href="/brands"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
            >
              Browse All Brands
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-10">
          <div className="lg:w-2/3 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {extractValue(brand.name, "Brand")}
            </h1>
            {/* <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">
              {extractValue(brand.description, "Discover our premium collection of products crafted with excellence.")}
            </p> */}
          </div>

          {brand.logo && (
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <div className="relative w-48 h-32 bg-white rounded-xl shadow-md p-4">
                <Image
                  src={getImageUrl(brand.logo)}
                  alt={extractValue(brand.name, "Brand Logo")}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.target.src = "/images/placeholder-brand.jpg";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Slider */}
        {brandProducts.length > 0 ? (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Our Products
                <span className="text-emerald-600 ml-2">({brandProducts.length})</span>
              </h2>
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ 
                clickable: true,
                dynamicBullets: true 
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 4 }
              }}
              className="pb-16"
            >
              {brandProducts.map((product) => {
                const productInfo = getProductInfo(product);
                
                return (
                  <SwiperSlide key={productInfo.id}>
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
                      <div className="relative w-full h-64">
                        <Image
                          src={productInfo.image}
                          alt={productInfo.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/images/placeholder-product.jpg";
                          }}
                        />
                        {/* {productInfo.hasDiscount && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            SALE
                          </div>
                        )} */}
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                          {productInfo.name}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="mr-3">
                            {productInfo.size}
                          </span>
                          {productInfo.country && productInfo.country !== "Global" && (
                            <>
                              <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                              <span>{productInfo.country}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            {productInfo.discountPrice ? (
                              <>
                                <span className="text-lg font-bold text-red-600">
                                  {productInfo.discountPrice}
                                </span>
                                <span className="text-sm line-through text-gray-400">
                                  {productInfo.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                {productInfo.price}
                              </span>
                            )}
                          </div>
                          
                          <Link
                            href={`/product/${productInfo.slug}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-1"
                          >
                            View
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are currently no products available for {extractValue(brand.name)}. Check back soon for new arrivals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
              >
                Browse All Products
              </Link>
              <Link
                href="/brands"
                className="border border-gray-300 hover:border-emerald-600 text-gray-700 hover:text-emerald-600 font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
              >
                Explore Other Brands
              </Link>
            </div>
          </div>
        )}

        {/* Brand Value Propositions */}
        {/* <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h4>
            <p className="text-gray-600 leading-relaxed">
              Carefully crafted with the finest ingredients and rigorous quality standards
            </p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h4>
            <p className="text-gray-600 leading-relaxed">
              Quick and reliable shipping to your doorstep across all locations
            </p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Favorite</h4>
            <p className="text-gray-600 leading-relaxed">
              Trusted and loved by thousands of satisfied customers worldwide
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
}