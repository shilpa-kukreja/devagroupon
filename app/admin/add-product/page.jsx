// app/admin/products/add/page.jsx
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import dynamic from "next/dynamic";
import AdminLayout from "../components/AdminLayout";

const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

export default function AddProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    thumbImg: null,
    galleryImg: [],
    stock: 0,
    country: "",
    brand: "",
    price: "",
    discountPrice: "",
    ml: "",
    kg: "",
    maincategory: "",
    category: "",
    subcategory: "",
    languageoflabels: "",
    NewProduct: false,
    ProductEan: "",
    Halal: false,
    Vegan: false,
    Frozen: false,
    Kosher: false,
    Allergens: "",
    Spiciness: "",
    Salt: "",
    Fat: "",
    ofwhichSugars: "",
    PackingComposition: "",
    variant: "",
    status: "active",
    width: "",
    height: "",
    weight: "",
    length: "",
    metatitle: "",
    metadescription: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);


  const id = searchParams.get("id");
  const isEditMode = !!id;

  // Debug logs
  useEffect(() => {
    console.log("Edit Mode:", isEditMode);
    console.log("Product ID:", id);
    console.log("Search Params:", Object.fromEntries(searchParams.entries()));
  }, [isEditMode, id, searchParams]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      toast.error("Error loading categories");
      console.error(error);
    }
  };

  // Enhanced product details fetch function
  const fetchProductDetails = async () => {
    if (!id) {
      console.log("No ID provided for edit mode");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching product with ID:", id);

      const response = await axios.get(`http://localhost:5000/api/product/products/${id}`);
      console.log("Full API Response:", response);

      if (response.data.success) {
        const product = response.data.data;

        console.log("Product data received:", product);

        if (!product) {
          toast.error("Product not found in response");
          return;
        }

        // Transform the product data to match form structure
        const transformedData = {
          name: product.name || "",
          slug: product.slug || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          thumbImg: product.thumbImg || "",
          galleryImg: product.galleryImg || [],
          stock: product.stock || 0,
          country: product.country?._id || product.country || "",
          brand: product.brand?._id || product.brand || "",
          price: product.price || "",
          discountPrice: product.discountPrice || "",
          ml: product.ml || "",
          kg: product.kg || "",
          maincategory: product.maincategory?._id || product.maincategory || "",
          category: product.category?._id || product.category || "",
          subcategory: product.subcategory?._id || product.subcategory || "",
          languageoflabels: product.languageoflabels || "",
          NewProduct: product.NewProduct || false,
          ProductEan: product.ProductEan || "",
          Halal: product.Halal || false,
          Vegan: product.Vegan || false,
          Frozen: product.Frozen || false,
          Kosher: product.Kosher || false,
          Allergens: product.Allergens || "",
          Spiciness: product.Spiciness || "",
          Salt: product.Salt || "",
          Fat: product.Fat || "",
          ofwhichSugars: product.ofwhichSugars || "",
          PackingComposition: product.PackingComposition || "",
          variant: product.variant || "",
          status: product.status || "active",
          width: product.width || "",
          height: product.height || "",
          weight: product.weight || "",
          length: product.length || "",
          metatitle: product.metatitle || "",
          metadescription: product.metadescription || ""
        };

        console.log("Transformed form data:", transformedData);
        setFormData(transformedData);

        // Handle image previews
        if (product.thumbImg) {
          const thumbUrl = product.thumbImg.startsWith('http')
            ? product.thumbImg
            : `http://localhost:5000/${product.thumbImg}`;
          setImagePreview(thumbUrl);
          console.log("Thumbnail preview set:", thumbUrl);
        }

        // Handle gallery images
        if (product.galleryImg?.length > 0) {
          const galleryUrls = product.galleryImg.map(img =>
            typeof img === 'string' && !img.startsWith('http')
              ? `http://localhost:5000/${img}`
              : img
          );
          setGalleryPreviews(galleryUrls);
          console.log("Gallery previews set:", galleryUrls);
        }

        toast.success("✅ Product loaded successfully");
      } else {
        console.error("API returned error:", response.data);
        toast.error("❌ Failed to load product: " + (response.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      console.error("Error response:", err.response);
      toast.error("❌ Error fetching product: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      console.log("Edit mode activated, fetching product details...");
      fetchProductDetails();
    }
  }, [isEditMode, id]);

  // Filter categories when main category changes
  useEffect(() => {
    if (formData.maincategory) {
      const filtered = categories.categories?.filter(
        cat => cat.maincategory?._id === formData.maincategory
      ) || [];
      setFilteredCategories(filtered);
      setFormData(prev => ({ ...prev, category: "", subcategory: "" }));
    }
  }, [formData.maincategory, categories.categories]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const filtered = categories.subcategories?.filter(
        sub => sub.category?._id === formData.category
      ) || [];
      setFilteredSubcategories(filtered);
      setFormData(prev => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category, categories.subcategories]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      if (name === "thumbImg" && files[0]) {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(files[0]);
      } else if (name === "galleryImg") {
        const newFiles = Array.from(files);
        setFormData(prev => ({ ...prev, [name]: [...prev.galleryImg, ...newFiles] }));
        // Create previews
        newFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setGalleryPreviews(prev => [...prev, e.target.result]);
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle description changes from CKEditor
  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prev => ({ ...prev, description: data }));
  };

  const handleShortDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prev => ({ ...prev, shortDescription: data }));
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImg: prev.galleryImg.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === "thumbImg") {
          // Only append thumbnail if it's a new file or in add mode
          if (formData[key] instanceof File) {
            formDataToSend.append("thumbImg", formData[key]);
          } else if (!isEditMode) {
            // In add mode, thumbImg is required
            toast.error("Please select a thumbnail image");
            setLoading(false);
            return;
          }
          // In edit mode, if no new file is selected, the existing image is preserved
        } else if (key === "galleryImg" && formData[key].length > 0) {
          // Handle both files and existing image URLs
          formData[key].forEach(item => {
            if (item instanceof File) {
              formDataToSend.append("galleryImg", item);
            }
          });
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add a flag to indicate edit mode to the backend
      if (isEditMode) {
        formDataToSend.append("isEditMode", "true");
      }

      const url = isEditMode
        ? `http://localhost:5000/api/product/products/${id}`
        : "http://localhost:5000/api/product/products";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEditMode ? "Product updated successfully!" : "Product created successfully!");
        router.push("/admin/product-lists");
      } else {
        toast.error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} product`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update the submit button text based on mode
  const submitButtonText = loading
    ? (isEditMode ? "Updating..." : "Creating...")
    : (isEditMode ? "Update Product" : "Create Product");

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditMode ? "Update existing product details" : "Create a new product for your catalog"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Basic Information</h3>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Short Description with CKEditor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <CKEditor
                      editor={typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-build-classic') : null}
                      data={formData.shortDescription}
                      onChange={handleShortDescriptionChange}
                      config={{
                        toolbar: ['bold', 'italic', 'link', 'bulletedList'],
                        height: '150px'
                      }}
                    />
                  </div>
                </div>

                {/* Category Hierarchy */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Category *
                    </label>
                    <select
                      name="maincategory"
                      value={formData.maincategory}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Main Category</option>
                      {categories.mainCategories?.map(mc => (
                        <option key={mc._id} value={mc._id}>{mc.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.maincategory}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">Select Category</option>
                      {filteredCategories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory *
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="">Select Subcategory</option>
                      {filteredSubcategories.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Brand and Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Brand</option>
                      {categories.brands?.map(brand => (
                        <option key={brand._id} value={brand._id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Country</option>
                      {categories.countries?.map(country => (
                        <option key={country._id} value={country._id}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Price ($)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Right Column - Media & Additional Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Media & Details</h3>

                {/* Thumbnail Image */}
                {/* Thumbnail Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image {!isEditMode && "*"}
                  </label>
                  <input
                    type="file"
                    name="thumbImg"
                    onChange={handleInputChange}
                    required={!isEditMode} // Only required in add mode
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Thumbnail preview"
                        className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                      />
                      {isEditMode && (
                        <p className="text-sm text-gray-500 mt-1">
                          Current image. Leave empty to keep existing.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  <input
                    type="file"
                    name="galleryImg"
                    onChange={handleInputChange}
                    multiple
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="flex flex-wrap gap-3 mt-3">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery preview ${index + 1}`}
                          className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ML
                    </label>
                    <input
                      type="text"
                      name="ml"
                      value={formData.ml}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 500ml"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      KG
                    </label>
                    <input
                      type="text"
                      name="kg"
                      value={formData.kg}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 1kg"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product EAN
                    </label>
                    <input
                      type="text"
                      name="ProductEan"
                      value={formData.ProductEan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="EAN code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language of Labels
                    </label>
                    <input
                      type="text"
                      name="languageoflabels"
                      value={formData.languageoflabels}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., English"
                    />
                  </div>
                </div>

                {/* Boolean Attributes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="NewProduct"
                      checked={formData.NewProduct}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      New Product
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="Halal"
                      checked={formData.Halal}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Halal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="Vegan"
                      checked={formData.Vegan}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Vegan
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="Frozen"
                      checked={formData.Frozen}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Frozen
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description Editor */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <CKEditor
                  editor={typeof window !== 'undefined' ? require('@ckeditor/ckeditor5-build-classic') : null}
                  data={formData.description}
                  onChange={handleDescriptionChange}
                  config={{
                    toolbar: [
                      'heading', '|', 'bold', 'italic', 'link', 'bulletedList',
                      'numberedList', 'blockQuote', 'imageUpload', 'insertTable',
                      'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed'
                    ]
                  }}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-6">Product Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergens
                  </label>
                  <input
                    type="text"
                    name="Allergens"
                    value={formData.Allergens}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List of allergens"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spiciness
                  </label>
                  <input
                    type="text"
                    name="Spiciness"
                    value={formData.Spiciness}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Spiciness level"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salt Content
                  </label>
                  <input
                    type="text"
                    name="Salt"
                    value={formData.Salt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Salt content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fat Content
                  </label>
                  <input
                    type="text"
                    name="Fat"
                    value={formData.Fat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Fat content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Of which Sugars
                  </label>
                  <input
                    type="text"
                    name="ofwhichSugars"
                    value={formData.ofwhichSugars}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sugar content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Packing Composition
                  </label>
                  <input
                    type="text"
                    name="PackingComposition"
                    value={formData.PackingComposition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Packing details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant
                  </label>
                  <input
                    type="text"
                    name="variant"
                    value={formData.variant}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Product variant"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Product weight"
                  />
                </div> */}
              </div>

              {/* Dimensions */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width
                  </label>
                  <input
                    type="text"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Width"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Height"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length
                  </label>
                  <input
                    type="text"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Length"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Weight"
                  />
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-6">SEO Information</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metatitle"
                    value={formData.metatitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Meta title for SEO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metadescription"
                    value={formData.metadescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Meta description for SEO"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}