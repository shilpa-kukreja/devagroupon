// services/apiService.js
const API_BASE_URL = 'https://devagroupon-1.onrender.com/api';

// Helper function to remove circular references
function removeCircularReferences(obj, seen = new WeakSet()) {
  if (typeof obj === 'object' && obj !== null) {
    if (seen.has(obj)) {
      return undefined; // Break circular reference
    }
    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => removeCircularReferences(item, seen));
    }

    const newObj = {};
    for (let key in obj) {
      // Skip problematic nested objects that might cause circular references
      if (key === 'products' || key === '__v' || key === 'createdAt' || key === 'updatedAt') {
        continue;
      }
      
      const value = obj[key];
      
      // Handle specific nested object types
      if (key === 'maincategory' || key === 'category' || key === 'subcategory' || key === 'brand') {
        if (value && typeof value === 'object') {
          // Only keep essential fields, remove nested arrays
          newObj[key] = {
            _id: value._id,
            name: value.name,
            slug: value.slug,
            banner: value.banner || null,
            // Don't include any arrays or nested objects
          };
        } else {
          newObj[key] = value;
        }
      } else if (key === 'country') {
        if (value && typeof value === 'object') {
          newObj[key] = {
            _id: value._id,
            name: value.name,
            flag: value.flag || null
          };
        } else {
          newObj[key] = value;
        }
      } else {
        const cleanedValue = removeCircularReferences(value, seen);
        if (cleanedValue !== undefined) {
          newObj[key] = cleanedValue;
        }
      }
    }
    return newObj;
  }
  return obj;
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Handle different response structures
  let result = data.data || data.products || data.categories || 
               data.brands || data.mainCategories || data || [];
  
  // Clean circular references
  return removeCircularReferences(result);
};

// Optimized version for better performance
function safeJSONParse(data) {
  try {
    // First, convert to string and parse to detect circular references
    const jsonString = JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (key === 'products' || key === 'categories' || key === 'subcategories') {
          // Return only IDs for arrays that might cause circular references
          return Array.isArray(value) ? value.map(item => item?._id || item?.id) : value;
        }
        // For nested objects, return only essential fields
        if (key === 'maincategory' || key === 'category' || key === 'subcategory' || key === 'brand') {
          return value ? { 
            _id: value._id, 
            name: value.name, 
            slug: value.slug 
          } : value;
        }
      }
      return value;
    });
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing error:', error);
    
    // Fallback: manual cleanup
    if (Array.isArray(data)) {
      return data.map(item => {
        const cleanItem = { ...item };
        // Remove potential circular reference sources
        delete cleanItem.products;
        delete cleanItem.categories;
        delete cleanItem.subcategories;
        
        // Flatten nested objects
        if (cleanItem.maincategory && typeof cleanItem.maincategory === 'object') {
          cleanItem.maincategory = { 
            _id: cleanItem.maincategory._id, 
            name: cleanItem.maincategory.name 
          };
        }
        if (cleanItem.category && typeof cleanItem.category === 'object') {
          cleanItem.category = { 
            _id: cleanItem.category._id, 
            name: cleanItem.category.name 
          };
        }
        if (cleanItem.subcategory && typeof cleanItem.subcategory === 'object') {
          cleanItem.subcategory = { 
            _id: cleanItem.subcategory._id, 
            name: cleanItem.subcategory.name 
          };
        }
        if (cleanItem.brand && typeof cleanItem.brand === 'object') {
          cleanItem.brand = { 
            _id: cleanItem.brand._id, 
            name: cleanItem.brand.name 
          };
        }
        
        return cleanItem;
      });
    }
    
    return data;
  }
}

// Alternative: Use a simple fetch with cleanup
const safeFetch = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Parse with custom reviver to handle circular references
    const data = JSON.parse(text, (key, value) => {
      // Remove circular references on the fly
      if (key === 'products' || key === 'categories' || key === 'subcategories') {
        return undefined; // Remove these arrays entirely
      }
      
      if (typeof value === 'object' && value !== null) {
        // For nested references, return only IDs
        if (value._id && (value.products || value.categories)) {
          return { _id: value._id, name: value.name, slug: value.slug };
        }
      }
      
      return value;
    });
    
    return data.data || data.products || data.categories || data.brands || data.mainCategories || data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

export const apiService = {
  // Main Categories
  async getMainCategories() {
    try {
      return await safeFetch(`${API_BASE_URL}/admin/main-categories`);
    } catch (error) {
      console.error('Error fetching main categories:', error);
      return [];
    }
  },

  // Categories
  async getCategories() {
    try {
      return await safeFetch(`${API_BASE_URL}/admin/categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Subcategories
  async getSubcategories() {
    try {
      return await safeFetch(`${API_BASE_URL}/admin/subcategories`);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  },

  // Brands
  async getBrands() {
    try {
      return await safeFetch(`${API_BASE_URL}/admin/brands`);
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  // Products
  async getProducts() {
    try {
      return await safeFetch(`${API_BASE_URL}/product/products`);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Countries
  async getCountries() {
    try {
      return await safeFetch(`${API_BASE_URL}/admin/countries`);
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  // About Brands
  async getAboutBrands() {
    try {
      return await safeFetch(`${API_BASE_URL}/aboutbrand/about-brands`);
    } catch (error) {
      console.error('Error fetching about brands:', error);
      return [];
    }
  },

  async getAboutBrandsByBrand(brandId) {
    try {
      return await safeFetch(`${API_BASE_URL}/aboutbrand/brand/${brandId}`);
    } catch (error) {
      console.error('Error fetching about brands by brand:', error);
      return [];
    }
  },

  async getAboutBrandsBySectionType(sectionType) {
    try {
      return await safeFetch(`${API_BASE_URL}/aboutbrand/section/${sectionType}`);
    } catch (error) {
      console.error('Error fetching about brands by section:', error);
      return [];
    }
  },

  async getAboutBrandById(id) {
    try {
      return await safeFetch(`${API_BASE_URL}/aboutbrand/${id}`);
    } catch (error) {
      console.error('Error fetching about brand by ID:', error);
      return null;
    }
  }
};