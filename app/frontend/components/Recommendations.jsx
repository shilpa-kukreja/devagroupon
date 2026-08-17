import { useState, useEffect } from "react";
import Image from "next/image";
import { apiService } from "./apiService";

export const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maincategory, setMaincategory] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, maincategoryData, subcategoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
          apiService.getMainCategories(),
          apiService.getSubcategories()
        ]);

        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setMaincategory(maincategoryData || []);
        setSubcategories(subcategoriesData || []);
      } catch (err) {
        console.error('Error fetching data for recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to extract ID from different data structures
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
      
      const fullUrl = `https://devagroupon-1.onrender.com/${cleanPath}`;
      
      // Validate URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/placeholder.png";
    }
  };

  // Get all products that have subcategories assigned
  const productsWithSubcategories = products.filter(product => {
    const productSubcategory = product.subcategory;
    return productSubcategory && extractId(productSubcategory);
  });

  // Group products by subcategory dynamically
  const productsBySubcategory = productsWithSubcategories.reduce((acc, product) => {
    const subcategoryId = extractId(product.subcategory);
    if (subcategoryId) {
      if (!acc[subcategoryId]) {
        acc[subcategoryId] = [];
      }
      acc[subcategoryId].push(product);
    }
    return acc;
  }, {});

  // Get subcategory details with proper hierarchy
  const getSubcategoryDetails = (subcategoryId) => {
    const subcategory = subcategories.find(sub => extractId(sub) === subcategoryId);
    if (subcategory) {
      const category = categories.find(cat => extractId(cat) === extractId(subcategory.category));
      const mainCat = maincategory.find(main => {
        if (category && category.maincategory) {
          return extractId(main) === extractId(category.maincategory);
        }
        return false;
      });
      
      return {
        subcategoryName: subcategory.name,
        categoryName: category?.name || 'Unknown Category',
        maincategoryName: mainCat?.name || 'Unknown Main Category',
        subcategoryImg: getImageUrl(subcategory.img)
      };
    }
    return { 
      subcategoryName: 'Unknown', 
      categoryName: 'Unknown', 
      maincategoryName: 'Unknown',
      subcategoryImg: null
    };
  };

  // Get product display information
  const getProductDisplayInfo = (product) => {
    return {
      name: product.name,
      code: product.sku || 'N/A',
      price: product.discountPrice || product.price,
      originalPrice: product.discountPrice ? product.price : null,
      image: getImageUrl(product.thumbImg),
      isNew: product.NewProduct || false,
      size: product.ml || product.g || product.kg || null,
      stock: product.stock,
      slug: product.slug
    };
  };

  const ProductCard = ({ product }) => {
    const productInfo = getProductDisplayInfo(product);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
        {/* Product Image */}
        <div className="bg-gray-50 h-48 flex items-center justify-center p-4 relative">
          <img 
            src={productInfo.image} 
            alt={productInfo.name}
            width={200}
            height={200}
            className="max-h-36 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {productInfo.isNew && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                NEW
              </span>
            )}
            {productInfo.originalPrice && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                SALE
              </span>
            )}
          </div>
          
          {/* Stock Indicator */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
            parseInt(productInfo.stock) > 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {parseInt(productInfo.stock) > 5 ? 'In Stock' : 'Low Stock'}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors min-h-[40px]">
            {productInfo.name}
          </h3>
          
          {/* Product Code */}
          <p className="text-xs text-gray-500 mb-2 font-mono">
            {productInfo.code}
          </p>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {productInfo.originalPrice ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    ${productInfo.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${productInfo.originalPrice}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${productInfo.price}
                </span>
              )}
            </div>
            
            {/* Size/Weight */}
            {productInfo.size && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {productInfo.size}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={parseInt(productInfo.stock) === 0}
          >
            {parseInt(productInfo.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-8 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">RECOMMENDATIONS</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">RECOMMENDATIONS</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // If no products with subcategories found
  if (Object.keys(productsBySubcategory).length === 0) {
    return (
      <div className="py-8 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">RECOMMENDATIONS</h2>
        <p className="text-gray-600">No products available for recommendations at the moment.</p>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
            RECOMMENDATIONS
          </h2>
          <p className="text-gray-600 mt-2">
            Discover products from our categories ({Object.keys(productsBySubcategory).length} subcategories available)
          </p>
        </div>

        {/* Subcategory Sections */}
        {Object.entries(productsBySubcategory).map(([subcategoryId, categoryProducts]) => {
          const { subcategoryName, categoryName, maincategoryName, subcategoryImg } = getSubcategoryDetails(subcategoryId);
          
          return (
            <div key={subcategoryId} className="mb-12 last:mb-0">
              {/* Subcategory Header */}
              <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  {subcategoryImg && subcategoryImg !== "/placeholder.png" && (
                    <img
                      src={subcategoryImg} 
                      alt={subcategoryName}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                     
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {subcategoryName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      From <span className="font-semibold">{categoryName}</span> • <span className="font-semibold">{maincategoryName}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition-colors px-4 py-2 border border-blue-600 rounded-lg hover:bg-blue-50">
                  View All
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={extractId(product)} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Simple version that matches your image layout exactly
export const SimpleDynamicRecommendations = ({ product }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await apiService.getProducts();
        setProducts(productsData || []);
      } catch (err) {
        console.error('Error fetching products for recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to extract ID from different data structures
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
      
      const fullUrl = `https://devagroupon-1.onrender.com/${cleanPath}`;
      
      // Validate URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Invalid image URL:', imgPath, error);
      return "/placeholder.png";
    }
  };

  // Safe ProductCard component
  const ProductCard = ({ product }) => {
    const productId = extractId(product);
    const imageUrl = getImageUrl(product.thumbImg);
    const productName = product.name || 'Unnamed Product';
    const productSlug = product.slug || productId;
    
    return (
      <a 
        href={`/frontend/product/${productSlug}`}
        className="group border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
      >
        <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={productName}
            width={200}
            height={200}
            className="object-contain max-h-40 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
            {productName}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{product.sku || "N/A"}</p>
          <p className="text-base font-semibold text-lime-600">
            ${product.discountPrice || product.price || "0.00"}
          </p>
        </div>
      </a>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-inner mt-12">
        <h2 className="text-xl font-bold text-gray-900 uppercase mb-6 border-b border-gray-200 pb-2">
          Recommended Products
        </h2>
        <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-gray-200 bg-white rounded-xl overflow-hidden">
              <div className="bg-gray-200 h-48"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-inner mt-12">
        <h2 className="text-xl font-bold text-gray-900 uppercase mb-6 border-b border-gray-200 pb-2">
          Recommended Products
        </h2>
        <p className="text-gray-500 text-center py-6">
          Product information not available.
        </p>
      </div>
    );
  }

  // Ensure we treat subcategory as array
  const productSubcategories = Array.isArray(product.subcategory)
    ? product.subcategory
    : [product.subcategory];

  // Filter products that share at least one subcategory with current product
  const relatedProducts = products.filter((p) => {
    if (extractId(p) === extractId(product)) return false; // Exclude current product
    
    const pSubcategories = Array.isArray(p.subcategory) ? p.subcategory : [p.subcategory];
    
    return pSubcategories.some((sub) => 
      productSubcategories.some(productSub => 
        extractId(productSub) === extractId(sub)
      )
    );
  });

  // Limit to 5 products
  const displayProducts = relatedProducts.slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-inner mt-12">
      <h2 className="text-xl font-bold text-gray-900 uppercase mb-6 border-b border-gray-200 pb-2">
        Recommended Products
      </h2>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {displayProducts.map((p) => (
            <ProductCard key={extractId(p)} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">
          No similar products found in this category.
        </p>
      )}
    </div>
  );
};