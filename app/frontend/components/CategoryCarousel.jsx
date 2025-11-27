'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { apiService } from './apiService';

const CategoryCarousel = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maincategory, setMaincategory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch main categories from backend
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoading(true);
        const categories = await apiService.getMainCategories();
        setMaincategory(Array.isArray(categories) ? categories : []);
      } catch (error) {
        console.error('Error fetching main categories:', error);
        setMaincategory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Update current index based on scroll position
      const cardWidth = 288; // w-72
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [maincategory]);

  // Function to get image URL (same as your navbar)
  const getImageUrl = (imgPath) => {
    try {
      if (!imgPath) return "/images/placeholder-product.jpg";
      
      // If it's already a full URL, return as is
      if (imgPath.startsWith('http')) return imgPath;
      
      // Ensure the path starts with a slash
      let cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
      
      // Remove any double slashes that might occur
      cleanPath = cleanPath.replace(/\/+/g, '/');
      
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${cleanPath}`;
      
      // Validate URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/images/placeholder-product.jpg";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!maincategory || maincategory.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No categories available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of premium products across various categories
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700 group-hover:text-lime-600 transition-colors" />
            </motion.button>
          )}
          
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700 group-hover:text-lime-600 transition-colors" />
            </motion.button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-8 pt-2 px-2 -mx-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex space-x-6"
            >
              {maincategory.map((category) => {
                const categoryId = category._id?.$oid || category._id;
                const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
                
                return (
                  <motion.div
                    key={categoryId}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                    className="flex-none w-72 lg:w-80 group cursor-pointer"
                  >
                    {/* Modern Card Design */}
                    <Link 
                      href={`/frontend/products/${categorySlug}`}
                      className="block"
                    >
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-lime-200">
                        
                        {/* Image Container with Clean Design */}
                        <div className="relative h-72 overflow-hidden">
                          <Image
                            src={getImageUrl(category.img)}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                          />
                          
                          {/* Subtle Overlay Only on Hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                          
                          {/* Floating Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                              Explore
                            </span>
                          </div>

                          {/* Hover Action Indicator */}
                          <div className="absolute top-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="bg-lime-600 text-white p-2 rounded-full shadow-lg">
                              <ChevronRightIcon className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Content Area - Clean and Professional */}
                        <div className="p-6">
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-lime-600 transition-colors duration-300 line-clamp-2">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {category.description || `Discover our premium collection of ${category.name}`}
                            </p>
                          </div>
                        </div>

                        {/* Elegant Border Effect on Hover */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-lime-500/20 transition-all duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        {maincategory.length > 4 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(maincategory.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const scrollAmount = index * 288 * 4;
                    scrollContainerRef.current.scrollTo({
                      left: scrollAmount,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-lime-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link 
            href="/frontend/products"
            className="inline-flex items-center bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded-full font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Categories
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCarousel;