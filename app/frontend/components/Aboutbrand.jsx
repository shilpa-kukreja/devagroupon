// components/AboutBrand.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { apiService } from "./apiService";

export default function AboutBrand({ brandSlug, sectionType = "all" }) {
  const [aboutContent, setAboutContent] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch brands first to get brand ID
        const brandsData = await apiService.getBrands();
        setBrands(brandsData || []);
        
        const targetBrand = brandsData.find(b => b.slug === brandSlug);
        
        if (targetBrand) {
          const brandId = targetBrand._id?.$oid || targetBrand._id;
          
          let aboutData;
          if (sectionType === "all") {
            aboutData = await apiService.getAboutBrandsByBrand(brandId);
          } else {
            aboutData = await apiService.getAboutBrandsBySectionType(sectionType);
            // Filter by brand
            aboutData = aboutData.filter(item => {
              const itemBrandId = item.brand?.$oid || item.brand;
              return itemBrandId === brandId;
            });
          }
          
          setAboutContent(aboutData || []);
        }
      } catch (err) {
        console.error('Error fetching about brand data:', err);
        setError('Failed to load brand information');
      } finally {
        setLoading(false);
      }
    };

    if (brandSlug) {
      fetchData();
    }
  }, [brandSlug, sectionType]);

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
      if (!imgPath) return "/images/placeholder-brand.jpg";
      if (imgPath.startsWith('http')) return imgPath;
      
      let cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://devagroupon-1.onrender.com'}/${cleanPath}`;
      
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/images/placeholder-brand.jpg";
    }
  };

  // Parse HTML content safely
  const parseContent = (content) => {
    if (!content) return '';
    return content.replace(/<[^>]*>/g, '');
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-gray-600 text-lg">Loading brand information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Content</h3>
          <p className="text-gray-600 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No content state
  if (aboutContent.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      {aboutContent.map((content, index) => (
        <AboutBrandSection 
          key={extractId(content)} 
          content={content} 
          index={index}
          getImageUrl={getImageUrl}
          parseContent={parseContent}
        />
      ))}
    </div>
  );
}

// Individual section component
function AboutBrandSection({ content, index, getImageUrl, parseContent }) {
  const sectionType = content.sectionType || 'main';
  
  // Define layouts based on section type
  const getLayoutConfig = (type) => {
    const configs = {
      main: {
        containerClass: "py-20 bg-gradient-to-br from-white to-gray-50",
        textAlignment: "text-left",
        showButtons: true,
        imagePosition: "right",
        spacing: "lg"
      },
      usp: {
        containerClass: "py-16 bg-white border-t border-gray-100",
        textAlignment: "text-center", 
        showButtons: false,
        imagePosition: "none",
        spacing: "md"
      },
      blend: {
        containerClass: "py-20 bg-gray-50",
        textAlignment: "text-left",
        showButtons: false,
        imagePosition: "left",
        spacing: "lg"
      },
      flavors: {
        containerClass: "py-20 bg-white",
        textAlignment: "text-left",
        showButtons: false,
        imagePosition: "right",
        spacing: "lg"
      }
    };
    
    return configs[type] || configs.main;
  };

  const config = getLayoutConfig(sectionType);
  const isImageRight = config.imagePosition === 'right';
  const hasImage = config.imagePosition !== 'none';
  const spacingClass = config.spacing === 'lg' ? "gap-12" : "gap-8";

  // Section-specific styling
  const getSectionDecoration = (type) => {
    switch (type) {
      case 'main':
        return {
          badge: "OUR STORY",
          badgeColor: "bg-red-600 text-white"
        };
      case 'blend':
        return {
          badge: "AUTHENTIC RECIPE",
          badgeColor: "bg-amber-500 text-white"
        };
      case 'usp':
        return {
          badge: "WHY CHOOSE US",
          badgeColor: "bg-emerald-600 text-white"
        };
      default:
        return {
          badge: null,
          badgeColor: ""
        };
    }
  };

  const decoration = getSectionDecoration(sectionType);

  return (
    <section 
      className={config.containerClass}
      style={content.color ? { backgroundColor: content.color } : {}}
    >
      <div className={`max-w-7xl mx-auto px-6 flex flex-col ${hasImage ? 'md:flex-row' : ''} items-center justify-between ${spacingClass}`}>
        
        {/* Text Section */}
        <motion.div 
          className={`flex flex-col justify-center ${!hasImage ? 'md:w-full max-w-4xl text-center' : 'md:w-1/2'} ${isImageRight ? 'order-1' : 'order-2'}`}
          initial={{ opacity: 0, x: isImageRight ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {decoration.badge && (
            <span className={`inline-block px-4 py-2 ${decoration.badgeColor} text-xs font-semibold tracking-wider uppercase rounded-full mb-6`}>
              {decoration.badge}
            </span>
          )}
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {content.heading}
          </h2>
          
          <div className={`text-gray-700 mb-8 leading-relaxed text-lg ${config.textAlignment}`}>
            {parseContent(content.content).split('. ').map((sentence, idx, arr) => (
              <p key={idx} className={idx < arr.length - 1 ? "mb-4" : "mb-0"}>
                {sentence}{idx < arr.length - 1 ? '.' : ''}
              </p>
            ))}
          </div>

          {config.showButtons && (
            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Explore Products
              </button>
              <a
                href="https://cryingthaiger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-emerald-600 font-medium py-3 px-6 border border-gray-300 rounded-lg hover:border-emerald-600 transition-all duration-300 inline-flex items-center"
              >
                Visit Website
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </motion.div>

        {/* Image Section */}
        {hasImage && content.image && (
          <motion.div 
            className={`flex justify-center ${isImageRight ? 'order-2' : 'order-1'} md:w-1/2`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-lg">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(content.image)}
                  alt={content.heading}
                  width={600}
                  height={600}
                  className="object-cover w-full h-auto"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-brand.jpg';
                  }}
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Optional decorative element */}
              {sectionType === 'main' && (
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 z-0"></div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}