"use client";
import { useState, useEffect, useMemo } from "react";
import { Filter, Grid, List, ChevronDown, ChevronUp, X, Snowflake } from "lucide-react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

import Link from "next/link";
import { apiService } from "../components/apiService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function FrozenProductsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [expandedFilters, setExpandedFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    countries: [],
    halal: false,
    vegan: false,
    new: false,
    kosher: false,
    allergens: [],
    language: [],
    salt: false,
    fat: false,
    sugar: false,
    unit: []
  });

  // Data states
  const [products, setProducts] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        mainCategoriesData,
        categoriesData,
        subcategoriesData,
        brandsData,
        productsData
      ] = await Promise.all([
        apiService.getMainCategories(),
        apiService.getCategories(),
        apiService.getSubcategories(),
        apiService.getBrands(),
        apiService.getProducts()
      ]);

      // Set data with fallback to empty arrays
      setMainCategories(Array.isArray(mainCategoriesData) ? mainCategoriesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      
      // Filter only frozen products
      const allProducts = Array.isArray(productsData) ? productsData : [];
      const frozenProducts = allProducts.filter(product => product.Frozen === true);
      setProducts(frozenProducts);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load frozen products. Please try again later.');
      setMainCategories([]);
      setCategories([]);
      setSubcategories([]);
      setBrands([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Get available filters based on frozen products
  const availableFilters = useMemo(() => {
    const brandSet = new Set();
    const countrySet = new Set();
    const allergenSet = new Set();
    const languageSet = new Set();
    const unitSet = new Set();

    products.forEach(product => {
      // Handle brands
      if (product.brand) {
        const brandId = extractId(product.brand);
        if (brandId) brandSet.add(brandId);
      }
      
      // Handle countries
      const country = product.country?.name || product.country;
      if (country) countrySet.add(country);
      
      // Handle allergens
      if (product.Allergens) {
        const allergens = Array.isArray(product.Allergens) 
          ? product.Allergens 
          : product.Allergens.split(',').map(a => a.trim());
        allergens.forEach(allergen => allergenSet.add(allergen));
      }
      
      // Handle languages
      if (product.languageoflabels) {
        languageSet.add(product.languageoflabels);
      }
      
      // Handle units
      if (product.ml) unitSet.add('ml');
      if (product.kg) unitSet.add('kg');
      if (product.unit) unitSet.add(product.unit);
    });

    // Filter brands to only show those available in frozen products
    const availableBrands = Array.from(brandSet).map(brandId => 
      brands.find(b => extractId(b) === brandId)
    ).filter(Boolean);

    return {
      brands: availableBrands,
      countries: Array.from(countrySet),
      allergens: Array.from(allergenSet),
      languages: Array.from(languageSet),
      units: Array.from(unitSet),
      hasHalal: products.some(p => p.Halal),
      hasVegan: products.some(p => p.Vegan),
      hasNew: products.some(p => p.NewProduct),
      hasKosher: products.some(p => p.Kosher),
      hasSalt: products.some(p => p.Salt),
      hasFat: products.some(p => p.Fat),
      hasSugar: products.some(p => p.ofwhichSugars),
    };
  }, [products, brands]);

  // Filter frozen products based on selected filters and search
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brandName?.toLowerCase().includes(query)
      );
    }

    // Apply brand filter
    if (selectedFilters.brands.length > 0) {
      filtered = filtered.filter(product => {
        const productBrandId = extractId(product.brand);
        return selectedFilters.brands.includes(productBrandId);
      });
    }

    // Apply country filter
    if (selectedFilters.countries.length > 0) {
      filtered = filtered.filter(product => {
        const productCountry = product.country?.name || product.country;
        return selectedFilters.countries.includes(productCountry);
      });
    }

    // Apply attribute filters
    if (selectedFilters.halal) {
      filtered = filtered.filter(product => product.Halal === true);
    }
    if (selectedFilters.vegan) {
      filtered = filtered.filter(product => product.Vegan === true);
    }
    if (selectedFilters.new) {
      filtered = filtered.filter(product => product.NewProduct === true);
    }
    if (selectedFilters.kosher) {
      filtered = filtered.filter(product => product.Kosher === true);
    }
    if (selectedFilters.salt) {
      filtered = filtered.filter(product => product.Salt === true);
    }
    if (selectedFilters.fat) {
      filtered = filtered.filter(product => product.Fat === true);
    }
    if (selectedFilters.sugar) {
      filtered = filtered.filter(product => product.ofwhichSugars === true);
    }

    // Apply allergen filter
    if (selectedFilters.allergens.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.Allergens) return false;
        const allergens = Array.isArray(product.Allergens) 
          ? product.Allergens 
          : product.Allergens.split(',').map(a => a.trim());
        return selectedFilters.allergens.some(allergen => 
          allergens.includes(allergen)
        );
      });
    }

    // Apply language filter
    if (selectedFilters.language.length > 0) {
      filtered = filtered.filter(product =>
        selectedFilters.language.includes(product.languageoflabels)
      );
    }

    // Apply unit filter
    if (selectedFilters.unit.length > 0) {
      filtered = filtered.filter(product =>
        (selectedFilters.unit.includes('ml') && product.ml) ||
        (selectedFilters.unit.includes('kg') && product.kg) ||
        (selectedFilters.unit.includes(product.unit))
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        break;
    }

    return filtered;
  }, [products, selectedFilters, priceRange, sortBy, searchQuery]);

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => {
      if (filterType === 'brands' || filterType === 'countries' || filterType === 'allergens' || filterType === 'language' || filterType === 'unit') {
        return {
          ...prev,
          [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
        };
      } else {
        return {
          ...prev,
          [filterType]: !prev[filterType]
        };
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      countries: [],
      halal: false,
      vegan: false,
      new: false,
      kosher: false,
      allergens: [],
      language: [],
      salt: false,
      fat: false,
      sugar: false,
      unit: []
    });
    setPriceRange([0, 1000]);
    setSearchQuery('');
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (imgPath.startsWith('http')) return imgPath;
    
    let cleanPath = imgPath;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }
    
    return `https://devagroupon.onrender.com/${cleanPath}`;
  };

  const FilterSection = ({ title, children, isExpanded = false }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleFilterSection(title)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-semibold text-gray-900">{title}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {(expandedFilters[title] !== false) && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading frozen products...</p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <X size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error}
            </h3>
            <button
              onClick={fetchAllData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div>
        <div className="bg-blue-50 py-12 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <Snowflake size={64} className="mx-auto text-blue-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frozen Products</h1>
            <p className="text-xl text-gray-600 mb-6">
              Explore our wide range of frozen foods, perfectly preserved for your convenience
            </p>
            <div className="bg-white rounded-lg p-4 inline-flex items-center gap-2">
              <Snowflake size={20} className="text-blue-500" />
              <span className="text-blue-600 font-semibold">
                {products.length} Frozen Products Available
              </span>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                </li>
                <ChevronDown size={16} className="rotate-[-90deg] mx-2" />
                <li className="flex items-center">
                  <Link href="/products" className="hover:text-blue-600 transition-colors">All Products</Link>
                </li>
                <ChevronDown size={16} className="rotate-[-90deg] mx-2" />
                <li className="text-blue-600 font-medium">Frozen Products</li>
              </ol>
            </nav>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search frozen products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Snowflake className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              </div>
            </div>

            <div className="flex gap-8">
              {/* Filter Sidebar */}
              <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden`}>
                {showFilters && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear all
                        </button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="lg:hidden p-1 hover:bg-gray-100 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Price Range */}
                    <FilterSection title="Price Range" isExpanded={true}>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </FilterSection>

                    {/* Brands */}
                    {availableFilters.brands.length > 0 && (
                      <FilterSection title="Brands">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {availableFilters.brands.map(brand => (
                            <label key={extractId(brand)} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.brands.includes(extractId(brand))}
                                onChange={() => toggleFilter('brands', extractId(brand))}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {brand.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}

                    {/* Countries */}
                    {availableFilters.countries.length > 0 && (
                      <FilterSection title="Country of Origin">
                        <div className="space-y-2">
                          {availableFilters.countries.map(country => (
                            <label key={country} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.countries.includes(country)}
                                onChange={() => toggleFilter('countries', country)}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {country}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}

                    {/* Frozen-specific attributes */}
                    <FilterSection title="Product Attributes">
                      <div className="space-y-3">
                        {availableFilters.hasNew && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.new}
                              onChange={() => toggleFilter('new')}
                              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">New Products</span>
                          </label>
                        )}
                        
                        {availableFilters.hasHalal && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.halal}
                              onChange={() => toggleFilter('halal')}
                              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Halal</span>
                          </label>
                        )}
                        
                        {availableFilters.hasVegan && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.vegan}
                              onChange={() => toggleFilter('vegan')}
                              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Vegan</span>
                          </label>
                        )}
                        
                        {availableFilters.hasKosher && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.kosher}
                              onChange={() => toggleFilter('kosher')}
                              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
                          </label>
                        )}
                      </div>
                    </FilterSection>

                    {/* Allergens */}
                    {availableFilters.allergens.length > 0 && (
                      <FilterSection title="Allergens">
                        <div className="space-y-2">
                          {availableFilters.allergens.map(allergen => (
                            <label key={allergen} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.allergens.includes(allergen)}
                                onChange={() => toggleFilter('allergens', allergen)}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {allergen}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}

                    {/* Unit */}
                    {availableFilters.units.length > 0 && (
                      <FilterSection title="Unit">
                        <div className="space-y-2">
                          {availableFilters.units.map(unit => (
                            <label key={unit} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.unit.includes(unit)}
                                onChange={() => toggleFilter('unit', unit)}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {unit === 'ml' ? 'Volume (ml)' : unit === 'kg' ? 'Weight (kg)' : unit}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex items-center justify-between">
                    {!showFilters && (
                      <button
                        onClick={() => setShowFilters(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Filter size={20} />
                        Show Filters
                      </button>
                    )}

                    <div className="flex items-center gap-4 ml-auto">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="default">Priority descending</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }>
                    {filteredProducts.map(product => (
                      <FrozenProductCard 
                        key={extractId(product)} 
                        product={product} 
                        viewMode={viewMode}
                        getImageUrl={getImageUrl}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Snowflake size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No frozen products found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

// Frozen Product Card Component
function FrozenProductCard({ product, viewMode, getImageUrl }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const getCountryCode = (country) => {
    const countryName = typeof country === 'string' ? country : country?.name;
    const map = {
      Thailand: "TH",
      Korea: "KR",
      "South Korea": "KR",
      India: "IN",
      Japan: "JP",
      China: "CN",
      USA: "US",
      Germany: "DE",
      France: "FR",
      Italy: "IT",
      "United Kingdom": "GB",
      Cambodia: "KH",
      Vietnam: "VN",
      Malaysia: "MY",
      Indonesia: "ID",
      Philippines: "PH",
      Singapore: "SG",
      Taiwan: "TW",
      Brazil: "BR",
      Mexico: "MX",
      Spain: "ES",
      Portugal: "PT",
      Netherlands: "NL",
      Belgium: "BE",
      Switzerland: "CH",
      Austria: "AT",
      Australia: "AU",
      Canada: "CA",
    };
    return map[countryName] || "UN";
  };

  const detailLink = `/frontend/product/${product.slug}`;
  const countryName = product.country?.name || product.country;
  const imageUrl = getImageUrl(product.thumbImg || product.image);
  const brandName = product.brand?.name || product.brandName;

  if (viewMode === "list") {
    return (
      <Link href={detailLink}>
        <div className="rounded-lg border border-blue-100 p-6 hover:shadow-lg transition-all cursor-pointer bg-white">
          <div className="flex gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={product.name || 'Frozen product'}
                fill
                className="object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                Frozen
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition">
                    {product.name || 'Frozen Product'}
                  </h3>
                  {brandName && (
                    <p className="text-sm text-gray-600 mb-2">by {brandName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ReactCountryFlag
                    countryCode={getCountryCode(countryName)}
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                  />
                  <span>{countryName || 'Unknown Country'}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${hasDiscount ? product.discountPrice : product.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {product.NewProduct && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      New
                    </span>
                  )}
                  {product.Halal && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Halal
                    </span>
                  )}
                  {product.Vegan && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Vegan
                    </span>
                  )}
                  {product.Kosher && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Kosher
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={detailLink}>
      <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer border border-blue-100 bg-white">
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name || 'Frozen product'}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
            onError={(e) => {
              e.target.src = '/placeholder.png';
            }}
          />
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
            Frozen
          </div>
          {product.NewProduct && (
            <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-10 right-2 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
              Sale
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ReactCountryFlag
              countryCode={getCountryCode(countryName)}
              svg
              style={{ width: "1.3em", height: "1.3em" }}
            />
            <span className="text-sm text-gray-600">{countryName || 'Unknown Country'}</span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
            {product.name || 'Frozen Product'}
          </h3>

          {brandName && (
            <p className="text-sm text-gray-600 mb-2">by {brandName}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${hasDiscount ? product.discountPrice : product.price}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {product.Halal && (
                <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">H</span>
              )}
              {product.Vegan && (
                <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">V</span>
              )}
              <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}