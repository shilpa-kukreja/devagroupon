// services/apiService.js
const API_BASE_URL =  'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  // Handle different response structures
  return data.data || data.products || data.categories || data.brands || data.mainCategories || data || [];
};

export const apiService = {
  // Main Categories
  async getMainCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/main-categories`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching main categories:', error);
      return [];
    }
  },

  // Categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Subcategories
  async getSubcategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/subcategories`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  },

  // Brands
  async getBrands() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/brands`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },

  // Products
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/product/products`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Countries
  async getCountries() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/countries`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

 

  // About Brands
  async getAboutBrands() {
    try {
      const response = await fetch(`${API_BASE_URL}/aboutbrand/about-brands`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching about brands:', error);
      return [];
    }
  },

  async getAboutBrandsByBrand(brandId) {
    try {
      const response = await fetch(`${API_BASE_URL}/aboutbrand/brand/${brandId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching about brands by brand:', error);
      return [];
    }
  },

  async getAboutBrandsBySectionType(sectionType) {
    try {
      const response = await fetch(`${API_BASE_URL}/aboutbrand/section/${sectionType}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching about brands by section:', error);
      return [];
    }
  },

  async getAboutBrandById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/aboutbrand/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching about brand by ID:', error);
      return null;
    }
  }

};