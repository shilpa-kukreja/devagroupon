'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { apiService } from '../components/apiService';

export default function AllBrandsPage() {
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const brandsGridRef = useRef(null);

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
      
      const fullUrl = `https://devagroupon.onrender.com/${cleanPath}`;
      
      // Validate URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/placeholder.png";
    }
  };

  // Group brands by first letter
  const brandsByLetter = brands.reduce((acc, brand) => {
    const letter = brand.name?.charAt(0).toUpperCase() || 'Other';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(brand);
    return acc;
  }, {});

  const availableLetters = Object.keys(brandsByLetter).sort();
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredBrands =
    selectedLetter === 'All' ? brands : brandsByLetter[selectedLetter] || [];

  const scrollToTop = () => {
    brandsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-6 pt-28 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading brands...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-6 pt-28 py-12">
          <div className="text-center py-16">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-6 pt-28 py-12">
        {/* Alphabet Filter */}
        <section className="bg-white rounded-2xl shadow-md p-6 mb-12 border border-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  setSelectedLetter('All');
                  scrollToTop();
                }}
                className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  selectedLetter === 'All'
                    ? 'bg-lime-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-lime-50 hover:text-lime-600 hover:shadow'
                }`}
              >
                All Brands ({brands.length})
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              {allLetters.map((letter) => {
                const isAvailable = availableLetters.includes(letter);
                const isSelected = selectedLetter === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedLetter(letter);
                        scrollToTop();
                      }
                    }}
                    disabled={!isAvailable}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center ${
                      isSelected
                        ? 'bg-lime-600 text-white shadow-md scale-105'
                        : isAvailable
                        ? 'bg-white text-gray-700 border border-gray-200 hover:bg-lime-50 hover:text-lime-600 hover:shadow'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Brand Results Header */}
        <div ref={brandsGridRef} className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedLetter === 'All'
              ? 'All Brands'
              : `Brands starting with "${selectedLetter}"`}
            <span className="text-lime-600 ml-2">({filteredBrands.length})</span>
          </h2>

          {selectedLetter !== 'All' && (
            <button
              onClick={() => setSelectedLetter('All')}
              className="text-lime-600 hover:text-lime-700 font-medium text-sm flex items-center"
            >
              View All Brands
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Brands Grid */}
        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
            {filteredBrands.map((brand) => (
              <Link 
                key={extractId(brand)}
                href={`/frontend/products/brand/${brand.slug}`}
              >
                <div className="group bg-white rounded-xl border border-gray-100 hover:border-lime-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center transform hover:-translate-y-1">
                  <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-lime-50 p-3 transition-all duration-300">
                    <Image
                      src={getImageUrl(brand.img)}
                      alt={brand.name || 'Brand logo'}
                      width={80}
                      height={80}
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <span className="text-gray-800 font-semibold group-hover:text-lime-600 transition-colors duration-200">
                    {brand.name || 'Unnamed Brand'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow border border-gray-100">
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No brands found</h3>
            <p className="text-gray-500 mb-6">
              {selectedLetter === 'All' 
                ? 'No brands available at the moment.' 
                : `There are no brands starting with "${selectedLetter}"`}
            </p>
            {selectedLetter !== 'All' && (
              <button
                onClick={() => setSelectedLetter('All')}
                className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-all duration-200 font-medium"
              >
                View All Brands
              </button>
            )}
          </div>
        )}

        {/* Statistics Section */}
        {/* {brands.length > 0 && (
          <section className="bg-lime-50 rounded-2xl p-6 border border-lime-200 mt-8">
            <div className="text-center">
              <h3 className="font-semibold text-gray-800 mb-2">
                Brand Collection Overview
              </h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="bg-lime-100 text-lime-800 px-2 py-1 rounded-full font-semibold">
                    {brands.length}
                  </span>
                  Total Brands
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-lime-100 text-lime-800 px-2 py-1 rounded-full font-semibold">
                    {availableLetters.length}
                  </span>
                  Alphabet Groups
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-lime-100 text-lime-800 px-2 py-1 rounded-full font-semibold">
                    {Math.max(...Object.values(brandsByLetter).map(arr => arr.length))}
                  </span>
                  Most in One Letter
                </div>
              </div>
            </div>
          </section>
        )} */}
      </main>

      <Footer />
    </div>
  );
}