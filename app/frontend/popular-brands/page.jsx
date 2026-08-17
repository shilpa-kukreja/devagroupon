"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { apiService } from "../components/apiService";

export default function PopularBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const brandsData = await apiService.getBrands();
        setBrands(brandsData || []);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Helper function to extract ID
  const extractId = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (item.$oid) return item.$oid;
    if (item._id?.$oid) return item._id.$oid;
    if (item._id) return item._id;
    if (item.id) return item.id.toString();
    return null;
  };

  // Safe image URL function
  const getImageUrl = (imgPath) => {
    try {
      if (!imgPath) return "/placeholder.png";
      if (imgPath.startsWith('http')) return imgPath;
      
      // Remove leading slash if present to avoid double slashes
      let cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
      
      const fullUrl = `http://localhost:5000/${cleanPath}`;
      
      // Validate URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/placeholder.png";
    }
  };

  // Filtering out popular brands
  const popularBrands = brands.filter((brand) => brand.populerbrand);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading premium brands...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Failed to load brands</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No popular brands state
  if (popularBrands.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Header Section */}
        <section className="text-center mt-12 pt-24 mb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Premium <span className="text-lime-600">Asian Brands</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-lime-400 to-lime-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-sm md:text-md leading-relaxed max-w-3xl mx-auto">
              Discover our curated selection of authentic Asian brands that have been delighting customers for generations. 
              From traditional classics to innovative culinary experiences.
            </p>
          </div>
        </section>

        {/* Empty State */}
        <section className="container mx-auto px-6 pb-20 flex-1">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Premium Brands Available</h3>
            <p className="text-gray-500 mb-6">
              We're currently updating our premium brand collection. Please check back soon.
            </p>
            <Link 
              href="/frontend/all-brands"
              className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-200 font-medium inline-block"
            >
              View All Brands
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="text-center mt-12 pt-24 mb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Premium <span className="text-lime-600">Asian Brands</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-lime-400 to-lime-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-sm md:text-md leading-relaxed max-w-3xl mx-auto">
            Discover our curated selection of authentic Asian brands that have been delighting customers for generations. 
            From traditional classics to innovative culinary experiences.
          </p>
          <div className="mt-4 text-sm text-lime-600 font-medium">
            {popularBrands.length} premium brand{popularBrands.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </section>

      {/* Brands Grid Section */}
      <section className="container mx-auto px-6 pb-20 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {popularBrands.map((brand) => (
            <div
              key={extractId(brand)}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500"
            >
              {/* Brand Image */}
              <div className="relative aspect-square w-full h-44 bg-gray-100">
                <Image
                  src={getImageUrl(brand.img)}
                  alt={brand.name || 'Brand logo'}
                  fill
                  className="object-cover aspect-square transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/placeholder.png';
                  }}
                />
                {/* Popular Badge */}
                <div className="absolute top-3 right-3 bg-lime-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  PREMIUM
                </div>
              </div>

              {/* Card Content (Brand Name, Description, Buttons) */}
              <div className="p-6">
                <div className="flex flex-col items-center">
                  {/* Brand Name */}
                  <h3 className="text-gray-900 text-xl font-semibold mb-2 text-center">
                    {brand.name || 'Unnamed Brand'}
                  </h3>

                  {/* Brand Description */}
                  <p className="text-gray-600 text-sm mb-4 text-center line-clamp-2">
                    {brand.description || 'Premium Asian brand offering authentic products.'}
                  </p>
                </div>

                {/* Buttons (View Products & About Brand) */}
                <div className="flex flex-col sm:flex-row gap-2 justify-between">
                  <Link 
                    href={`/frontend/products/brand/${brand.slug}`}
                    className="bg-black text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition duration-300 text-center flex-1"
                  >
                    View Products
                  </Link>
                  <Link 
                    href={`/frontend/about/${brand.slug}`} 
                    className="bg-lime-500 border-2 border-lime-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-lime-600 hover:border-lime-600 transition duration-300 text-center flex-1"
                  >
                    About Brand
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Brands CTA */}
        {brands.length > popularBrands.length && (
          <div className="text-center mt-12">
            <div className="bg-lime-50 rounded-xl p-6 border border-lime-200 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Explore More Brands
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover our complete collection of {brands.length} authentic Asian brands
              </p>
              <Link 
                href="/frontend/all-brands"
                className="inline-flex items-center gap-2 bg-lime-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-lime-700 transition-all duration-200"
              >
                View All Brands
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}