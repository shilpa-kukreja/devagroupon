"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Filter, Grid, List, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiService } from "../components/apiService";

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug || [];
  
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
    frozen: false,
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
  const [countries, setCountries] = useState([]);
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
        productsData,
        countriesData
      ] = await Promise.all([
        apiService.getMainCategories(),
        apiService.getCategories(),
        apiService.getSubcategories(),
        apiService.getBrands(),
        apiService.getProducts(),
        apiService.getCountries()
      ]);

      // Set data with fallback to empty arrays
      setMainCategories(Array.isArray(mainCategoriesData) ? mainCategoriesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      setBrands(Array.isArray(brandsData) ? brandsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCountries(Array.isArray(countriesData) ? countriesData : []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load products. Please try again later.');
      // Set empty arrays as fallback
      setMainCategories([]);
      setCategories([]);
      setSubcategories([]);
      setBrands([]);
      setProducts([]);
      setCountries([]);
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

  // Determine current navigation context
  const currentContext = useMemo(() => {
    if (slug.length === 0) return { type: 'all', data: null };
    
    const lastSlug = slug[slug.length - 1];
    
    // Check if it's a new products route
    if (slug[0] === 'new') {
      return { type: 'new', data: { name: 'New Products', slug: 'new' } };
    }
    
    // Check if it's a brand route
    if (slug[0] === 'brand') {
      const brand = brands.find(b => b.slug === lastSlug);
      if (brand) return { type: 'brand', data: brand };
    }
    
    // Check if it's a country route
    if (slug[0] === 'country') {
      const countryName = slug.slice(1).join(' ').replace(/-/g, ' ');
      const formattedCountryName = countryName.replace(/\b\w/g, l => l.toUpperCase());
      return { type: 'country', data: { name: formattedCountryName, slug: lastSlug } };
    }
    
    // Check main category
    const mainCat = mainCategories.find(cat => cat.slug === lastSlug);
    if (mainCat) return { type: 'maincategory', data: mainCat };
    
    // Check category
    const cat = categories.find(c => c.slug === lastSlug);
    if (cat) return { type: 'category', data: cat };
    
    // Check subcategory
    const subCat = subcategories.find(sc => sc.slug === lastSlug);
    if (subCat) return { type: 'subcategory', data: subCat };
    
    return { type: 'all', data: null };
  }, [slug, mainCategories, categories, subcategories, brands]);

  // Get products based on current context
  const contextProducts = useMemo(() => {
    let filteredProducts = products;

    // Filter products based on navigation context
    if (currentContext.type === 'new') {
      filteredProducts = filteredProducts.filter(product => 
        product.NewProduct === true
      );
    } else if (currentContext.type === 'brand') {
      const brandId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productBrandId = extractId(product.brand);
        return productBrandId === brandId;
      });
    } else if (currentContext.type === 'country') {
      filteredProducts = filteredProducts.filter(product => {
        const productCountry = product.country?.name || product.country;
        return productCountry?.toLowerCase() === currentContext.data.name.toLowerCase();
      });
    } else if (currentContext.type === 'maincategory') {
      const mainId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productMainId = extractId(product.maincategory);
        return productMainId === mainId;
      });
    } else if (currentContext.type === 'category') {
      const catId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productCatId = extractId(product.category);
        return productCatId === catId;
      });
    } else if (currentContext.type === 'subcategory') {
      const subId = extractId(currentContext.data);
      filteredProducts = filteredProducts.filter(product => {
        const productSubId = extractId(product.subcategory);
        return productSubId === subId;
      });
    }

    return filteredProducts;
  }, [products, currentContext]);

  // Get available filters based on current context products
  const availableFilters = useMemo(() => {
    const brandSet = new Set();
    const countrySet = new Set();
    const allergenSet = new Set();
    const languageSet = new Set();
    const unitSet = new Set();

    contextProducts.forEach(product => {
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

    // Filter brands to only show those available in current context
    const availableBrands = Array.from(brandSet).map(brandId => 
      brands.find(b => extractId(b) === brandId)
    ).filter(Boolean);

    return {
      brands: availableBrands,
      countries: Array.from(countrySet),
      allergens: Array.from(allergenSet),
      languages: Array.from(languageSet),
      units: Array.from(unitSet),
      hasHalal: contextProducts.some(p => p.Halal),
      hasVegan: contextProducts.some(p => p.Vegan),
      hasNew: contextProducts.some(p => p.NewProduct) && currentContext.type !== 'new',
      hasKosher: contextProducts.some(p => p.Kosher),
      hasFrozen: contextProducts.some(p => p.Frozen),
      hasSalt: contextProducts.some(p => p.Salt),
      hasFat: contextProducts.some(p => p.Fat),
      hasSugar: contextProducts.some(p => p.ofwhichSugars),
    };
  }, [contextProducts, currentContext.type, brands]);

  // Filter products based on selected filters and search
  const filteredProducts = useMemo(() => {
    let filtered = contextProducts;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brandName?.toLowerCase().includes(query)
      );
    }

    // Apply brand filter (only if not already filtered by brand route)
    if (selectedFilters.brands.length > 0 && currentContext.type !== 'brand') {
      filtered = filtered.filter(product => {
        const productBrandId = extractId(product.brand);
        return selectedFilters.brands.includes(productBrandId);
      });
    }

    // Apply country filter (only if not already filtered by country route)
    if (selectedFilters.countries.length > 0 && currentContext.type !== 'country') {
      filtered = filtered.filter(product => {
        const productCountry = product.country?.name || product.country;
        return selectedFilters.countries.includes(productCountry);
      });
    }

    // Apply new filter (only if not already on new products page)
    if (selectedFilters.new && currentContext.type !== 'new') {
      filtered = filtered.filter(product => product.NewProduct === true);
    }

    // Apply attribute filters
    if (selectedFilters.halal) {
      filtered = filtered.filter(product => product.Halal === true);
    }
    if (selectedFilters.vegan) {
      filtered = filtered.filter(product => product.Vegan === true);
    }
    if (selectedFilters.kosher) {
      filtered = filtered.filter(product => product.Kosher === true);
    }
    if (selectedFilters.frozen) {
      filtered = filtered.filter(product => product.Frozen === true);
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
        // Default sorting by priority or ID
        filtered.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        break;
    }

    return filtered;
  }, [contextProducts, selectedFilters, priceRange, sortBy, currentContext.type, searchQuery]);

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
      frozen: false,
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

  const getBreadcrumbPath = () => {
    const path = [{ name: 'Home', href: '/' }];
    
    if (currentContext.type === 'all') {
      path.push({ name: 'All Products', href: '/products' });
    } else if (currentContext.type === 'new') {
      path.push({ name: 'All Products', href: '/products' });
      path.push({ 
        name: 'New Products', 
        href: `/products/new` 
      });
    } else if (currentContext.type === 'brand') {
      path.push({ name: 'All Products', href: '/products' });
      path.push({ 
        name: currentContext.data.name, 
        href: `/products/brand/${currentContext.data.slug}` 
      });
    } else if (currentContext.type === 'country') {
      path.push({ name: 'All Products', href: '/products' });
      path.push({ 
        name: `${currentContext.data.name} Products`, 
        href: `/products/country/${currentContext.data.slug}` 
      });
    } else {
      path.push({ name: 'All Products', href: '/products' });
      
      if (currentContext.type === 'maincategory') {
        path.push({ 
          name: currentContext.data.name, 
          href: `/products/${currentContext.data.slug}` 
        });
      } else if (currentContext.type === 'category') {
        const category = currentContext.data;
        const mainCat = mainCategories.find(mc => 
          extractId(mc) === extractId(category.maincategory)
        );
        
        if (mainCat) {
          path.push({ 
            name: mainCat.name, 
            href: `/products/${mainCat.slug}` 
          });
        }
        
        path.push({ 
          name: category.name, 
          href: `/products/${mainCat?.slug}/${category.slug}` 
        });
      } else if (currentContext.type === 'subcategory') {
        const subcategory = currentContext.data;
        const category = categories.find(c => 
          extractId(c) === extractId(subcategory.category)
        );
        const mainCat = mainCategories.find(mc => 
          extractId(mc) === extractId(category?.maincategory)
        );
        
        if (mainCat) {
          path.push({ 
            name: mainCat.name, 
            href: `/products/${mainCat.slug}` 
          });
        }
        if (category) {
          path.push({ 
            name: category.name, 
            href: `/products/${mainCat?.slug}/${category.slug}` 
          });
        }
        
        path.push({ 
          name: subcategory.name, 
          href: `/products/${mainCat?.slug}/${category?.slug}/${subcategory.slug}` 
        });
      }
    }
    
    return path;
  };

  const getPageTitle = () => {
    switch (currentContext.type) {
      case 'new':
        return 'New Products';
      case 'brand':
        return currentContext.data.name;
      case 'country':
        return `${currentContext.data.name} Products`;
      case 'maincategory':
      case 'category':
      case 'subcategory':
        return currentContext.data.name;
      default:
        return 'All Products';
    }
  };

  const getProductCountText = () => {
    const total = filteredProducts.length;
    const contextTotal = contextProducts.length;
    
    let text = `Showing ${total} product${total !== 1 ? 's' : ''}`;
    
    if (contextTotal !== total) {
      text += ` (filtered from ${contextTotal} products)`;
    }
    
    if (currentContext.type === 'new') {
      text += ` - All new arrivals`;
    }
    
    return text;
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (imgPath.startsWith('http')) return imgPath;
    
    // Handle different path formats
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
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
              className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
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
        <img src="/banner/newsletterbanner.webp" alt="Banner" className="w-full h-auto" />
        <div className="min-h-screen bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                {getBreadcrumbPath().map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <ChevronDown size={16} className="rotate-[-90deg] mx-2" />}
                    <Link 
                      href={item.href}
                      className="hover:text-lime-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600">
                {getProductCountText()}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-8">
              {/* Filter Sidebar */}
              <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden`}>
                {showFilters && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-lime-600 hover:text-lime-700 font-medium"
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

                    {/* Brands - Hide if already on brand page */}
                    {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
                      <FilterSection title="Brands">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {availableFilters.brands.map(brand => (
                            <label key={extractId(brand)} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.brands.includes(extractId(brand))}
                                onChange={() => toggleFilter('brands', extractId(brand))}
                                className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {brand.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}

                    {/* Countries - Hide if already on country page */}
                    {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (
                      <FilterSection title="Country of Origin">
                        <div className="space-y-2">
                          {availableFilters.countries.map(country => (
                            <label key={country} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.countries.includes(country)}
                                onChange={() => toggleFilter('countries', country)}
                                className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {country}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}

                    {/* Attributes */}
                    <FilterSection title="Attributes">
                      <div className="space-y-3">
                        {/* New Products filter - Hide if already on new products page */}
                        {availableFilters.hasNew && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.new}
                              onChange={() => toggleFilter('new')}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
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
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
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
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
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
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Kosher</span>
                          </label>
                        )}

                        {availableFilters.hasFrozen && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.frozen}
                              onChange={() => toggleFilter('frozen')}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Frozen</span>
                          </label>
                        )}
                        
                        {availableFilters.hasSugar && (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedFilters.sugar}
                              onChange={() => toggleFilter('sugar')}
                              className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Sugar</span>
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
                                className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {allergen}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    )}

                    {/* Language */}
                    {availableFilters.languages.length > 0 && (
                      <FilterSection title="Language on the Label">
                        <div className="space-y-2">
                          {availableFilters.languages.map(language => (
                            <label key={language} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.language.includes(language)}
                                onChange={() => toggleFilter('language', language)}
                                className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {language}
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
                                className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
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
                        className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
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
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
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
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? ' text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                      <ProductCard 
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
                      <Filter size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
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

// ProductCard Component
function ProductCard({ product, viewMode, getImageUrl }) {
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
      "test country": "US",
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

  // URL to product detail page
  const detailLink = `/frontend/product/${product.slug}`;

  // Extract country name
  const countryName = product.country?.name || product.country;

  // Safe image URL handling
  const imageUrl = getImageUrl(product.thumbImg || product.image);

  // Get brand name
  const brandName = product.brand?.name || product.brandName;

  // --- List View ---
  if (viewMode === "list") {
    return (
      <Link href={detailLink}>
        <div className="rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer bg-white">
          <div className="flex gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={product.name || 'Product image'}
                fill
                className="object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-lime-600 transition">
                    {product.name || 'Unnamed Product'}
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
                {product.NewProduct && (
                  <span className="bg-lime-100 text-lime-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // --- Grid View ---
  return (
    <Link href={detailLink}>
      <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer border border-gray-100 bg-white">
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name || 'Product image'}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300 p-4"
            onError={(e) => {
              e.target.src = '/placeholder.png';
            }}
          />
          {product.NewProduct && (
            <span className="absolute top-2 left-2 bg-lime-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
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

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-lime-600 transition">
            {product.name || 'Unnamed Product'}
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
            <button className="bg-lime-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-lime-600 transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}