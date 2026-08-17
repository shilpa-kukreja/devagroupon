"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Filter, Grid, List, ChevronDown, ChevronUp, X } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { apiService } from "../../components/apiService";

// Enhanced Helper function to clean and normalize data
// Enhanced Helper function to clean and normalize data
function cleanData(data) {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => {
      if (!item || typeof item !== 'object') return item;

      const cleanItem = { ...item };

      // Preserve ID in standard format - handle $oid properly
      if (cleanItem._id && cleanItem._id.$oid) {
        cleanItem._id = cleanItem._id.$oid;
      } else if (cleanItem.id && cleanItem.id.$oid) {
        cleanItem._id = cleanItem.id.$oid;
      } else {
        cleanItem._id = cleanItem._id || cleanItem.id || (cleanItem.$oid ? cleanItem.$oid : null);
      }

      // For nested objects, extract the ID and name
      ['maincategory', 'category', 'subcategory', 'brand', 'country'].forEach(key => {
        if (cleanItem[key]) {
          if (typeof cleanItem[key] === 'object') {
            // Handle nested objects with $oid format
            const nestedObject = cleanItem[key];

            // Extract the ID - handle $oid format properly
            let nestedId = null;
            if (nestedObject._id && nestedObject._id.$oid) {
              nestedId = nestedObject._id.$oid;
            } else if (nestedObject.id && nestedObject.id.$oid) {
              nestedId = nestedObject.id.$oid;
            } else if (nestedObject.$oid) {
              nestedId = nestedObject.$oid;
            } else {
              nestedId = nestedObject._id || nestedObject.id;
            }

            const nestedName = nestedObject.name;

            // Store both the full object and the ID separately
            cleanItem[`${key}_id`] = nestedId;
            cleanItem[`${key}_name`] = nestedName;

            // Keep the nested object but simplified
            cleanItem[key] = {
              _id: nestedId,
              name: nestedName,
              slug: nestedObject.slug,
              ...(key === 'maincategory' && { banner: nestedObject.banner }),
              ...(key === 'country' && { flag: nestedObject.flag })
            };
          } else if (typeof cleanItem[key] === 'string') {
            // If it's already a string (might be an ID)
            cleanItem[`${key}_id`] = cleanItem[key];
          }
        }
      });

      return cleanItem;
    });
  }

  return data;
}

// ProductCard component (unchanged)
const ProductCard = ({ product, viewMode, getImageUrl }) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const getCountryCode = (country) => {
    const countryName = typeof country === 'string' ? country : country?.name;
    const map = {
      Thailand: "TH",
      Korea: "KR",
      India: "IN",
      Japan: "JP",
      China: "CN",
      USA: "US",
      Germany: "DE",
      France: "FR",
      Italy: "IT",
      "United Kingdom": "GB",
      Cambodia: "KH",
      Philippines: "PH",
      Vietnam: "VN",
      "test country": "US",
    };
    return map[countryName] || "UN";
  };

  const detailLink = `/frontend/product/${product.slug}`;
  const countryName = product.country?.name || product.country || product.country_name;
  const imageUrl = getImageUrl(product.thumbImg);

  if (viewMode === "list") {
    return (
      <Link href={detailLink}>
        <div className="rounded-lg border border-gray-200 p-4 hover:shadow-lg transition cursor-pointer bg-white">
          <div className="flex gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
              <img
                src={imageUrl}
                alt={product.name || 'Product image'}
                className="object-contain rounded-md"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hover:text-lime-600 transition line-clamp-2">
                {product.name || 'Unnamed Product'}
              </h3>

              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-xl font-bold text-gray-900">
                  ${hasDiscount ? product.discountPrice : product.price}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-lg text-gray-500 line-through">
                    ${product.price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ReactCountryFlag
                  countryCode={getCountryCode(countryName)}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
                <span className="truncate">{countryName || 'Unknown Country'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={detailLink}>
      <div className="rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group cursor-pointer border border-gray-100 bg-white">
        <div className="relative aspect-square bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name || 'Product image'}
            className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <ReactCountryFlag
              countryCode={getCountryCode(countryName)}
              svg
              style={{ width: "1.3em", height: "1.3em" }}
            />
            <span className="text-xs sm:text-sm text-gray-600 truncate">{countryName || 'Unknown Country'}</span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-lime-600 transition leading-tight">
            {product.name || 'Unnamed Product'}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ${hasDiscount ? product.discountPrice : product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ProductsPage() {
  const params = useParams();
  const slug = params.slug || [];

  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [expandedFilters, setExpandedFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    countries: [],
    halal: false,
    vegan: false,
    new: false,
    kosher: false,
    producttype: "Food",
    allergens: [],
    language: [],
    frozen: false,
    salt: false,
    fat: false,
    sugar: false,
    unit: []
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [maincategory, setMaincategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enhanced extractId function
  const extractId = useCallback((item) => {
    if (!item) return null;

    // If it's already a string, return it
    if (typeof item === 'string') return item;

    // If it's an object
    if (typeof item === 'object') {
      // Handle MongoDB ObjectId format: { $oid: "..." }
      if (item.$oid) return item.$oid;
      // Handle nested _id: { _id: { $oid: "..." } }
      if (item._id && item._id.$oid) return item._id.$oid;
      // Handle plain _id or id fields
      if (item._id) return String(item._id);
      if (item.id) return String(item.id);
    }

    return null;
  }, []);

  // Compare IDs properly
  const compareIds = useCallback((id1, id2) => {
    if (!id1 || !id2) return false;
    return String(id1).trim() === String(id2).trim();
  }, []);

  const getImageUrl = useCallback((imgPath) => {
    if (!imgPath) return "/products/product1.webp";
    if (imgPath.startsWith('http')) return imgPath;

    let cleanPath = imgPath;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    return `http://localhost:5000/${cleanPath}`;
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

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

      // Clean all data
      const cleanMainCategories = cleanData(mainCategoriesData);
      const cleanCategories = cleanData(categoriesData);
      const cleanSubcategories = cleanData(subcategoriesData);
      const cleanBrands = cleanData(brandsData);
      const cleanProducts = cleanData(productsData);

      setMaincategory(Array.isArray(cleanMainCategories) ? cleanMainCategories : []);
      setCategories(Array.isArray(cleanCategories) ? cleanCategories : []);
      setSubcategories(Array.isArray(cleanSubcategories) ? cleanSubcategories : []);
      setBrands(Array.isArray(cleanBrands) ? cleanBrands : []);
      setProducts(Array.isArray(cleanProducts) ? cleanProducts : []);

      console.log('✅ Data loaded:');
      console.log('   Products:', cleanProducts?.length || 0);
      console.log('   Main categories:', cleanMainCategories?.length || 0);
      console.log('   Categories:', cleanCategories?.length || 0);
      console.log('   Subcategories:', cleanSubcategories?.length || 0);
      console.log('   Brands:', cleanBrands?.length || 0);

      // Debug: Show sample product data
      if (cleanProducts?.length > 0) {
        console.log('🔍 Sample product structure:', {
          name: cleanProducts[0].name,
          maincategory: cleanProducts[0].maincategory,
          maincategory_id: cleanProducts[0].maincategory_id,
          category: cleanProducts[0].category,
          category_id: cleanProducts[0].category_id,
          subcategory: cleanProducts[0].subcategory,
          subcategory_id: cleanProducts[0].subcategory_id,
          brand: cleanProducts[0].brand,
          brand_id: cleanProducts[0].brand_id,
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setMaincategory([]);
      setCategories([]);
      setSubcategories([]);
      setBrands([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

//   // In your fetchAllData function, after loading data:
// console.log('🔍 All Main Categories:', cleanMainCategories.map(mc => ({
//   id: mc._id,
//   name: mc.name,
//   slug: mc.slug
// })));

// console.log('🔍 Product Main Category IDs:');
// cleanProducts.forEach(p => {
//   console.log(`  ${p.name}:`, {
//     maincategory_id: p.maincategory_id,
//     maincategory_name: p.maincategory_name
//   });
// });


  // Enhanced Current context detection
  const currentContext = useMemo(() => {
    console.log('🔍 Determining current context for slug:', slug);

    if (slug.length === 0) return { type: 'all', data: null };

    const lastSlug = slug[slug.length - 1];
    const secondSlug = slug.length > 1 ? slug[1] : null;

    // Check for special routes first
    if (slug[0] === 'new') {
      return { type: 'new', data: { name: 'New Products', slug: 'new' } };
    }

    if (slug[0] === 'brand') {
      const brand = brands.find(b => {
        const brandSlug = b.slug || b.name?.toLowerCase().replace(/\s+/g, '-');
        return brandSlug === lastSlug;
      });
      console.log('Brand search:', { lastSlug, found: brand });
      if (brand) return { type: 'brand', data: brand };
    }

    if (slug[0] === 'country') {
      const countryName = slug.slice(1).join(' ').replace(/-/g, ' ');
      return {
        type: 'country',
        data: {
          name: countryName,
          slug: lastSlug
        }
      };
    }

    // Check subcategories first
    const subCat = subcategories.find(sc => {
      const subCatSlug = sc.slug || sc.name?.toLowerCase().replace(/\s+/g, '-');
      return subCatSlug === lastSlug;
    });

    if (subCat) {
      console.log('Found subcategory:', subCat);
      return { type: 'subcategory', data: subCat };
    }

    // Check categories
    const cat = categories.find(c => {
      const catSlug = c.slug || c.name?.toLowerCase().replace(/\s+/g, '-');
      return catSlug === lastSlug;
    });

    if (cat) {
      console.log('Found category:', cat);
      return { type: 'category', data: cat };
    }

    // Check main categories
    const mainCat = maincategory.find(cat => {
      const mainCatSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
      return mainCatSlug === lastSlug;
    });

    if (mainCat) {
      console.log('Found main category:', mainCat);
      return { type: 'maincategory', data: mainCat };
    }

    console.log('No matching context found');
    return { type: 'all', data: null };
  }, [slug, maincategory, categories, subcategories, brands]);

  // Enhanced Context products filtering
  const contextProducts = useMemo(() => {
    console.log('🔄 Filtering context products...');
    console.log('   Current context:', currentContext);
    console.log('   Total products:', products.length);

    let filteredProducts = [...products];

    if (!filteredProducts.length) {
      console.log('   No products available');
      return [];
    }

    console.log('   First product sample:', {
      name: filteredProducts[0]?.name,
      maincategory: filteredProducts[0]?.maincategory,
      maincategory_id: filteredProducts[0]?.maincategory_id,
      category: filteredProducts[0]?.category,
      category_id: filteredProducts[0]?.category_id,
      subcategory: filteredProducts[0]?.subcategory,
      subcategory_id: filteredProducts[0]?.subcategory_id,
    });

    if (currentContext.type === 'new') {
      filteredProducts = filteredProducts.filter(product => product.NewProduct === true);
      console.log('   New products filter:', filteredProducts.length);
    }
    else if (currentContext.type === 'brand' && currentContext.data) {
      const brandId = extractId(currentContext.data);
      console.log('   Brand ID to match:', brandId);

      filteredProducts = filteredProducts.filter(product => {
        const productBrandId = extractId(product.brand) || product.brand_id;
        const matches = compareIds(productBrandId, brandId);
        return matches;
      });
      console.log('   Brand filter results:', filteredProducts.length);
    }
    else if (currentContext.type === 'country' && currentContext.data) {
      const countryName = currentContext.data.name?.toLowerCase();
      console.log('   Country to match:', countryName);

      filteredProducts = filteredProducts.filter(product => {
        const productCountry = product.country?.name || product.country || product.country_name;
        const matches = productCountry?.toLowerCase() === countryName;
        return matches;
      });
      console.log('   Country filter results:', filteredProducts.length);
    }
    else if (currentContext.type === 'maincategory' && currentContext.data) {
      const mainCatId = extractId(currentContext.data);
      console.log('   Main category ID to match:', mainCatId);

      filteredProducts = filteredProducts.filter(product => {
        // Try multiple ways to get the main category ID
        const productMainCatId = extractId(product.maincategory) || product.maincategory_id;
        const matches = compareIds(productMainCatId, mainCatId);

        if (matches) {
          console.log('   ✓ Product matches main category:', product.name,
            'Product maincat ID:', productMainCatId,
            'Expected maincat ID:', mainCatId);
        }
        return matches;
      });
      console.log('   Main category filter results:', filteredProducts.length);
    }
    else if (currentContext.type === 'category' && currentContext.data) {
      const catId = extractId(currentContext.data);
      console.log('   Category ID to match:', catId);

      filteredProducts = filteredProducts.filter(product => {
        const productCatId = extractId(product.category) || product.category_id;
        const matches = compareIds(productCatId, catId);
        return matches;
      });
      console.log('   Category filter results:', filteredProducts.length);
    }
    else if (currentContext.type === 'subcategory' && currentContext.data) {
      const subCatId = extractId(currentContext.data);
      console.log('   Subcategory ID to match:', subCatId);

      filteredProducts = filteredProducts.filter(product => {
        const productSubCatId = extractId(product.subcategory) || product.subcategory_id;
        const matches = compareIds(productSubCatId, subCatId);
        return matches;
      });
      console.log('   Subcategory filter results:', filteredProducts.length);
    }
    else if (currentContext.type === 'all') {
      console.log('   Showing all products:', filteredProducts.length);
    }

    console.log('   Final context products:', filteredProducts.length);

    // Debug: Show sample of filtered products
    if (filteredProducts.length > 0) {
      console.log('   Sample filtered products:');
      filteredProducts.slice(0, 3).forEach((p, i) => {
        console.log(`     ${i + 1}. ${p.name}`);
        console.log(`       Maincategory: ${p.maincategory?.name || p.maincategory_name}`);
        console.log(`       Category: ${p.category?.name || p.category_name}`);
        console.log(`       Subcategory: ${p.subcategory?.name || p.subcategory_name}`);
      });
    }

    return filteredProducts;
  }, [products, currentContext, extractId, compareIds]);

  console.log("📊 Context products count:", contextProducts.length);

  // Rest of the component remains mostly the same, but with enhanced filtering...

  const availableFilters = useMemo(() => {
    const productTypeSet = new Set();
    if (!contextProducts.length) {
      return {
        brands: [],
        countries: [],
        allergens: [],
        languages: [],
        units: [],
        hasHalal: false,
        hasVegan: false,
        hasNew: false,
        hasKosher: false,
        hasFrozen: false,
        hasSalt: false,
        hasFat: false,
        hasSugar: false,
      };
    }

    const brandSet = new Set();
    const countrySet = new Set();
    const allergenSet = new Set();
    const languageSet = new Set();
    const unitSet = new Set();

    contextProducts.forEach(product => {
      // Brand
      if (product.brand) {
        const brandId = extractId(product.brand) || product.brand_id;
        if (brandId) brandSet.add(brandId);
      }

      if (product.producttype) {
        productTypeSet.add(product.producttype);
      }

      // Country
      const country = product.country?.name || product.country || product.country_name;
      if (country) countrySet.add(country);

      // Allergens
      if (product.Allergens && typeof product.Allergens === 'string') {
        product.Allergens.split(',').forEach(allergen => {
          const trimmed = allergen.trim();
          if (trimmed) allergenSet.add(trimmed);
        });
      }

      // Language
      if (product.languageoflabels) {
        languageSet.add(product.languageoflabels);
      }

      // Units
      if (product.ml) unitSet.add('ml');
      if (product.kg) unitSet.add('kg');
    });

    const availableBrands = Array.from(brandSet).map(brandId =>
      brands.find(b => compareIds(extractId(b), brandId))
    ).filter(Boolean);

    return {
      brands: availableBrands,
      countries: Array.from(countrySet),
      allergens: Array.from(allergenSet),
      languages: Array.from(languageSet),
      producttypes: Array.from(productTypeSet),
      units: Array.from(unitSet),
      hasHalal: contextProducts.some(p => p.Halal === true),
      hasVegan: contextProducts.some(p => p.Vegan === true),
      hasNew: contextProducts.some(p => p.NewProduct === true) && currentContext.type !== 'new',
      hasKosher: contextProducts.some(p => p.Kosher === true),
      hasFrozen: contextProducts.some(p => p.Frozen === true),
      hasSalt: contextProducts.some(p => p.Salt === true),
      hasFat: contextProducts.some(p => p.Fat === true),
      hasSugar: contextProducts.some(p => p.ofwhichSugars === true),
    };
  }, [contextProducts, currentContext.type, brands, extractId, compareIds]);

  const filteredProducts = useMemo(() => {
    console.log('🎯 Applying filters...');
    let filtered = [...contextProducts];

    if (!filtered.length) {
      console.log('   No products to filter');
      return [];
    }

    console.log('   Starting with:', filtered.length, 'products');

    // Brand filter
    if (selectedFilters.brands.length > 0 && currentContext.type !== 'brand') {
      const before = filtered.length;
      filtered = filtered.filter(product => {
        const productBrandId = extractId(product.brand) || product.brand_id;
        return selectedFilters.brands.some(brandId =>
          compareIds(productBrandId, brandId)
        );
      });
      console.log('   Brand filter:', before, '->', filtered.length);
    }

    // Country filter
    if (selectedFilters.countries.length > 0 && currentContext.type !== 'country') {
      const before = filtered.length;
      filtered = filtered.filter(product => {
        const productCountry = product.country?.name || product.country || product.country_name;
        return selectedFilters.countries.includes(productCountry);
      });
      console.log('   Country filter:', before, '->', filtered.length);
    }

    // Product Type filter (Food / Retail)
    if (selectedFilters.producttype) {
      const before = filtered.length;
      filtered = filtered.filter(
        product => product.producttype === selectedFilters.producttype
      );
      console.log('   ProductType filter:', before, '->', filtered.length);
    }

    // Boolean filters
    const booleanFilters = [
      { key: 'new', prop: 'NewProduct' },
      { key: 'halal', prop: 'Halal' },
      { key: 'vegan', prop: 'Vegan' },
      { key: 'kosher', prop: 'Kosher' },
      { key: 'frozen', prop: 'Frozen' },
      { key: 'salt', prop: 'Salt' },
      { key: 'fat', prop: 'Fat' },
      { key: 'sugar', prop: 'ofwhichSugars' }
    ];

    booleanFilters.forEach(({ key, prop }) => {
      if (selectedFilters[key] && (key !== 'new' || currentContext.type !== 'new')) {
        const before = filtered.length;
        filtered = filtered.filter(product => product[prop] === true);
        console.log(`   ${key} filter:`, before, '->', filtered.length);
      }
    });

    // Allergens filter
    if (selectedFilters.allergens.length > 0) {
      const before = filtered.length;
      filtered = filtered.filter(product =>
        product.Allergens &&
        selectedFilters.allergens.some(allergen =>
          product.Allergens.includes(allergen)
        )
      );
      console.log('   Allergens filter:', before, '->', filtered.length);
    }

    // Language filter
    if (selectedFilters.language.length > 0) {
      const before = filtered.length;
      filtered = filtered.filter(product =>
        selectedFilters.language.includes(product.languageoflabels)
      );
      console.log('   Language filter:', before, '->', filtered.length);
    }

    // Unit filter
    if (selectedFilters.unit.length > 0) {
      const before = filtered.length;
      filtered = filtered.filter(product =>
        (selectedFilters.unit.includes('ml') && product.ml) ||
        (selectedFilters.unit.includes('kg') && product.kg)
      );
      console.log('   Unit filter:', before, '->', filtered.length);
    }

    // Price range filter
    const beforePrice = filtered.length;
    filtered = filtered.filter(product => {
      const price = product.discountPrice || product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    console.log('   Price filter:', beforePrice, '->', filtered.length);

    // Sorting
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
        break;
    }

    console.log('   Final filtered products:', filtered.length);
    return filtered;
  }, [contextProducts, selectedFilters, priceRange, sortBy, currentContext.type, extractId, compareIds]);

  console.log("✅ Final filteredProducts:", filteredProducts.length);

  // Rest of the component functions remain the same...
  const toggleFilter = useCallback((filterType, value) => {
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
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({
      brands: [],
      countries: [],
      halal: false,
      vegan: false,
      new: false,
      kosher: false,
      producttype: "",
      allergens: [],
      language: [],
      frozen: false,
      salt: false,
      fat: false,
      sugar: false,
      unit: []
    });
    setPriceRange([0, 100000]);
    setMobileFiltersOpen(false);
  }, []);

  const toggleFilterSection = useCallback((section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const getPageTitle = useMemo(() => {
    switch (currentContext.type) {
      case 'new': return 'New Products';
      case 'brand': return currentContext.data?.name || 'Brand Products';
      case 'country': return `${currentContext.data?.name || 'Country'} Products`;
      case 'maincategory':
      case 'category':
      case 'subcategory': return currentContext.data?.name || 'Products';
      default: return 'All Products';
    }
  }, [currentContext]);

  const bannerImage = useMemo(() => {
    if (currentContext.type === "maincategory") {
      return getImageUrl(currentContext.data?.banner);
    }

    if (currentContext.type === "category") {
      const mainCat = maincategory.find(mc =>
        compareIds(extractId(mc), extractId(currentContext.data?.maincategory))
      );
      return mainCat?.banner ? getImageUrl(mainCat.banner) : "/banner/newsletterbanner.webp";
    }

    if (currentContext.type === "subcategory") {
      const category = categories.find(c =>
        compareIds(extractId(c), extractId(currentContext.data?.category))
      );
      const mainCat = maincategory.find(mc =>
        compareIds(extractId(mc), extractId(category?.maincategory))
      );
      return mainCat?.banner ? getImageUrl(mainCat.banner) : "/banner/newsletterbanner.webp";
    }

    return "/banner/newsletterbanner.webp";
  }, [currentContext, maincategory, categories, getImageUrl, extractId, compareIds]);

  const FilterSection = useCallback(({ title, children, isExpanded = false }) => (
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
  ), [expandedFilters, toggleFilterSection]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24">
        <img
          src={bannerImage}
          alt={getPageTitle}
          className="w-full h-full object-cover"
        />

        <div className="min-h-screen bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {getPageTitle}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {contextProducts.length !== filteredProducts.length &&
                  ` (filtered from ${contextProducts.length} products)`}
                {currentContext.type === 'new' && ' - All new arrivals'}
              </p>
            </div>

            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              <div className={`hidden lg:block ${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0`}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
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

                  <FilterSection title="Price Range" isExpanded={true}>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="100000"
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

                  {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
                    <FilterSection title="Brands">
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableFilters.brands.map(brand => {
                          const brandId = extractId(brand);
                          return (
                            <label key={brandId} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.brands.includes(brandId)}
                                onChange={() => toggleFilter('brands', brandId)}
                                className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {brand.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </FilterSection>
                  )}

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

                  <FilterSection title="Attributes">
                    <div className="space-y-3">
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
                              {unit === 'ml' ? 'Volume (ml)' : 'Weight (kg)'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="lg:hidden flex items-center gap-4">
                      <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm"
                      >
                        <Filter size={18} />
                        Filters
                        {Object.values(selectedFilters).flat().filter(Boolean).length > 0 && (
                          <span className="bg-white text-lime-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {Object.values(selectedFilters).flat().filter(Boolean).length}
                          </span>
                        )}
                      </button>
                    </div>

                    {!showFilters && (
                      <button
                        onClick={() => setShowFilters(true)}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"
                      >
                        <Filter size={20} />
                        Show Filters
                      </button>
                    )}

                    <div className="flex items-center gap-4 ml-auto flex-wrap">

                      {/* Product Type Filter */}
                      {availableFilters.producttypes?.length > 0 && (
                        <select
                          value={selectedFilters.producttype}
                          onChange={(e) =>
                            setSelectedFilters(prev => ({
                              ...prev,
                              producttype: e.target.value
                            }))
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-lime-500 min-w-[140px]"
                        >
                          <option value="Food">Food</option>
                          {availableFilters.producttypes
                            .filter(type => type !== "Food")
                            .map(type => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                        </select>

                      )}

                      {/* Sort By */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-lime-500 min-w-[160px]"
                      >
                        <option value="default">Priority descending</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>


                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-lime-100 text-lime-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className={
                    viewMode === 'grid'
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4"
                  }>
                    {filteredProducts.map(product => {
                      const productId = extractId(product);
                      return (
                        <ProductCard
                          key={productId}
                          product={product}
                          viewMode={viewMode}
                          getImageUrl={getImageUrl}
                        />
                      );
                    })}
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
                      {contextProducts.length > 0
                        ? "Try adjusting your filters"
                        : "No products available in this category"}
                    </p>
                    {contextProducts.length > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="bg-lime-500 text-white px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Mobile Filters */}
      {mobileFiltersOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-full sm:w-96 bg-white z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-lime-600 hover:text-lime-700 font-medium"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 pb-32 overflow-y-auto flex-1">
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {availableFilters.brands.length > 0 && currentContext.type !== 'brand' && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableFilters.brands.map(brand => {
                      const brandId = extractId(brand);
                      return (
                        <label key={brandId} className="flex items-center gap-3 cursor-pointer group py-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters.brands.includes(brandId)}
                            onChange={() => toggleFilter('brands', brandId)}
                            className="w-4 h-4 text-lime-500 border-gray-300 rounded focus:ring-lime-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {brand.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {availableFilters.countries.length > 0 && currentContext.type !== 'country' && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Countries</h3>
                  <div className="space-y-2">
                    {availableFilters.countries.map(country => (
                      <label key={country} className="flex items-center gap-3 cursor-pointer group py-2">
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
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-lime-500 text-white py-3 rounded-lg font-semibold hover:bg-lime-600 transition-colors"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}