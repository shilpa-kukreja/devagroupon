// controllers/productController.js
import BrandModel from '../models/BrandModel.js';
import CategoryModel from '../models/CategoryModel.js';
import CountryModel from '../models/CountryModel.js';
import MainCategoryModel from '../models/MainCategoryModel.js';
import Product from '../models/ProductModel.js';

import SubcategoryModel from '../models/SubcategoryModel.js';

// Get categories for dropdown
export const getCategoriesForDropdown = async (req, res) => {
  try {
    const [mainCategories, categories, subcategories, brands, countries] = await Promise.all([
      MainCategoryModel.find({ status: 'active' }).select('name _id'),
      CategoryModel.find({ status: 'active' }).populate('maincategory', 'name').select('name _id maincategory'),
      SubcategoryModel.find({ status: 'active' }).populate('category', 'name').select('name _id category'),
      BrandModel.find({ status: 'active' }).select('name _id'),
      CountryModel.find({ status: 'active' }).select('name _id')
    ]);

    res.status(200).json({
      success: true,
      data: {
        mainCategories,
        categories,
        subcategories,
        brands,
        countries
      }
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Create Product
// export const createProduct = async (req, res) => {
//   try {
//     const productData = req.body;

//     // Handle file uploads if using multer
//     if (req.files) {
//       if (req.files.thumbImg) {
//         productData.thumbImg = req.files.thumbImg[0].path;
//       }
//       if (req.files.galleryImg) {
//         productData.galleryImg = req.files.galleryImg.map(file => file.path);
//       }
//     }

//     // Convert string values to proper types
//     if (productData.price) productData.price = parseFloat(productData.price);
//     if (productData.discountPrice) productData.discountPrice = parseFloat(productData.discountPrice);
//     if (productData.stock) productData.stock = parseInt(productData.stock);
//     if (productData.NewProduct) productData.NewProduct = productData.NewProduct === 'true';

//     // Convert measurements
//     const measurements = ['width', 'height', 'weight', 'length'];
//     measurements.forEach(field => {
//       if (productData[field]) productData[field] = parseFloat(productData[field]);
//     });

//     // Convert boolean fields
//     const booleanFields = ['Halal', 'Vegan', 'Frozen', 'Kosher'];
//     booleanFields.forEach(field => {
//       if (productData[field] !== undefined) {
//         productData[field] = productData[field] === 'true';
//       }
//     });

//     const product = await Product.create(productData);

//     // Populate the created product
//     const populatedProduct = await Product.findById(product._id)
//       .populate('maincategory', 'name')
//       .populate('category', 'name')
//       .populate('subcategory', 'name')
//       .populate('brand', 'name')
//       .populate('country', 'name');

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully!",
//       data: populatedProduct
//     });

//   } catch (error) {
//     console.error("Create product error:", error);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Product with this slug or SKU already exists."
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };


export const createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Create product data object
    const productData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.thumbImg) {
        productData.thumbImg = req.files.thumbImg[0].path;
      }
      if (req.files.galleryImg) {
        productData.galleryImg = req.files.galleryImg.map(file => file.path);
      }
    }

    // Generate slug from product name
    if (productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-') // Replace multiple - with single -
        .trim();
    } else {
      return res.status(400).json({
        success: false,
        message: "Product name is required to generate slug"
      });
    }

    // Debug: Check what values we're receiving
    console.log('Product data before conversion:', productData);

    // Convert string values to proper types with safety checks
    if (productData.price !== undefined && productData.price !== '') {
      productData.price = parseFloat(productData.price);
    } else {
      return res.status(400).json({
        success: false,
        message: "Price is required"
      });
    }

    if (productData.discountPrice !== undefined && productData.discountPrice !== '') {
      productData.discountPrice = parseFloat(productData.discountPrice);
    } else {
      productData.discountPrice = null;
    }

    if (productData.stock !== undefined && productData.stock !== '') {
      productData.stock = parseInt(productData.stock);
    } else {
      productData.stock = 0;
    }

    // Convert boolean fields safely
    productData.NewProduct = productData.NewProduct === 'true';

    // Convert measurements with safety checks - FIXED
    const measurements = ['width', 'height', 'weight', 'length'];
    measurements.forEach(field => {
      if (productData[field] !== undefined && productData[field] !== '') {
        const parsedValue = parseFloat(productData[field]);
        // Only set if it's a valid number, not NaN
        if (!isNaN(parsedValue)) {
          productData[field] = parsedValue;
        } else {
          productData[field] = null; // Set to null instead of NaN
        }
      } else {
        productData[field] = null; // Set empty values to null
      }
    });

    // Convert other boolean fields safely
    const booleanFields = ['Halal', 'Vegan', 'Frozen', 'Kosher'];
    booleanFields.forEach(field => {
      if (productData[field] !== undefined) {
        productData[field] = productData[field] === 'true';
      } else {
        productData[field] = false;
      }
    });

    // Normalize producttype
    if (productData.producttype) {
      productData.producttype =
        productData.producttype.charAt(0).toUpperCase() +
        productData.producttype.slice(1).toLowerCase();
    }

    // Fallback safety
    if (!['Food', 'Retail'].includes(productData.producttype)) {
      productData.producttype = 'Food';
    }

    // Handle numeric fields that might be empty
    const numericFields = ['ml', 'kg'];
    numericFields.forEach(field => {
      if (productData[field] === '') {
        productData[field] = null;
      }
    });

    // Ensure all required fields have values
    const requiredFields = ['name', 'price', 'maincategory', 'category', 'subcategory', 'brand', 'country'];
    const missingFields = requiredFields.filter(field => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    console.log('Product data after conversion:', productData);

    // Create the product
    const product = await Product.create(productData);

    // Populate the created product
    const populatedProduct = await Product.findById(product._id)
      .populate('maincategory', 'name')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('brand', 'name')
      .populate('country', 'name');

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: populatedProduct
    });

  } catch (error) {
    console.error("Create product error:", error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this name or slug already exists."
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get All Products with advanced filtering
export const getSalesProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100,
      search = '',
      status = '',
      category = '',
      brand = '',
      maincategory = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = {};

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Category filters
    if (category) {
      filter.category = category;
    }
    if (brand) {
      filter.brand = brand;
    }
    if (maincategory) {
      filter.maincategory = maincategory;
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('maincategory', 'name')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('brand', 'name')
      .populate('country', 'name')
      .sort(sortConfig)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Fetch the existing product first (to retain old images if not replaced)
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.thumbImg && req.files.thumbImg.length > 0) {
        // New thumbnail uploaded → replace
        updateData.thumbImg = req.files.thumbImg[0].path;
      } else {
        // Keep existing thumbnail
        updateData.thumbImg = existingProduct.thumbImg;
      }

      if (req.files.galleryImg && req.files.galleryImg.length > 0) {
        // New gallery images uploaded → replace
        updateData.galleryImg = req.files.galleryImg.map(file => file.path);
      } else {
        // Keep existing gallery images
        updateData.galleryImg = existingProduct.galleryImg;
      }
    } else {
      // No files uploaded → retain existing images
      updateData.thumbImg = existingProduct.thumbImg;
      updateData.galleryImg = existingProduct.galleryImg;
    }

    // Convert data types safely
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.discountPrice) updateData.discountPrice = parseFloat(updateData.discountPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    if (updateData.producttype) {
      updateData.producttype =
        updateData.producttype.charAt(0).toUpperCase() +
        updateData.producttype.slice(1).toLowerCase();
    }


    // Boolean conversions
    const booleanFields = ['NewProduct', 'Halal', 'Vegan', 'Frozen', 'Kosher'];
    booleanFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = updateData[field] === 'true' || updateData[field] === true;
      }
    });

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('maincategory', 'name')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('brand', 'name')
      .populate('country', 'name');

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct
    });

  } catch (error) {
    console.error("Update product error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug or SKU already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!"
    });

  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get Product by ID
// In your controller file
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Received request for product ID:", id);

    // Add validation for ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await Product.findById(id)
      .populate('maincategory', 'name')
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('brand', 'name')
      .populate('country', 'name');

    console.log("Found product:", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("Get product error:", error);

    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

