import BrandModel from "../models/BrandModel.js";
import CategoryModel from "../models/CategoryModel.js";
import MainCategoryModel from "../models/MainCategoryModel.js";
import SubcategoryModel from "../models/SubcategoryModel.js";
import CountryModel from "../models/CountryModel.js";

// Main Category CRUD
export const createMainCategory = async (req, res) => {
  try {
    const { name, status = "active" } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!req.files?.img || !req.files?.banner) {
      return res.status(400).json({
        success: false,
        message: "Image and Banner are required"
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 -]/g, "")
      .replace(/\s+/g, "-");

    const img = `/uploads/maincategory/${req.files.img[0].filename}`;
    const banner = `/uploads/maincategory/${req.files.banner[0].filename}`;

    const mainCategory = await MainCategoryModel.create({
      name,
      slug,
      img,
      banner,
      status
    });

    res.status(201).json({
      success: true,
      message: "Main category created successfully!",
      data: mainCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMainCategories = async (req, res) => {
  try {
    const mainCategories = await MainCategoryModel.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: mainCategories
    });
  } catch (error) {
    console.error("Get main categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const updateMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
    }

    if (status) updateData.status = status;

    if (req.files?.img) {
      updateData.img = `/uploads/maincategory/${req.files.img[0].filename}`;
    }

    if (req.files?.banner) {
      updateData.banner = `/uploads/maincategory/${req.files.banner[0].filename}`;
    }

    const category = await MainCategoryModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Main category updated successfully",
      data: category
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteMainCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const mainCategory = await MainCategoryModel.findByIdAndDelete(id);

    if (!mainCategory) {
      return res.status(404).json({
        success: false,
        message: "Main category not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Main category deleted successfully!",
      data: mainCategory
    });

  } catch (error) {
    console.error("Delete main category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Similar update and delete functions for other models...

// Category CRUD
export const createCategory = async (req, res) => {
  try {
    const { name, maincategory, status = "active" } = req.body;

    if (!name || !maincategory) {
      return res.status(400).json({
        success: false,
        message: "Name and main category are required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required."
      });
    }

    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');

    // Construct image URL
    const img = `/uploads/categories/${req.file.filename}`;

    const category = await CategoryModel.create({
      name,
      slug,
      img,
      maincategory,
      status
    });

    // Populate the main category details in response
    await category.populate('maincategory');

    res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: category
    });

  } catch (error) {
    console.error("Create category error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().populate('maincategory').sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, img, maincategory, status } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
    }
    if (img) updateData.img = img;
    if (maincategory) updateData.maincategory = maincategory;
    if (status) updateData.status = status;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('maincategory');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: category
    });

  } catch (error) {
    console.error("Update category error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
      data: category
    });

  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Add similar update and delete functions for Subcategories, Brands, and Countries...

// Subcategory CRUD
export const createSubcategory = async (req, res) => {
  try {
    const { name, category, status = "active" } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required."
      });
    }

    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');

    // Construct image URL
    const img = `/uploads/subcategories/${req.file.filename}`;

    const subcategory = await SubcategoryModel.create({
      name,
      slug,
      img,
      category,
      status
    });

    // Populate the category details in response
    await subcategory.populate('category');

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully!",
      data: subcategory
    });

  } catch (error) {
    console.error("Create subcategory error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Subcategory with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await SubcategoryModel.find().populate('category').sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    console.error("Get subcategories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};



export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, status } = req.body;

    const updateData = { name, category, status };

    // If name is being updated, update slug too
    if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
    }

    // If new image is uploaded
    if (req.file) {
      updateData.img = `/uploads/subcategories/${req.file.filename}`;

      // Optional: Delete old image file
      // You might want to implement this to clean up storage
    }

    const subcategory = await SubcategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found."
      });
    }

    res.json({
      success: true,
      message: "Subcategory updated successfully!",
      data: subcategory
    });

  } catch (error) {
    console.error("Update subcategory error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Subcategory with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await SubcategoryModel.findByIdAndDelete(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully!",
      data: subcategory
    });

  } catch (error) {
    console.error("Delete subcategory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Brand CRUD
export const createBrand = async (req, res) => {
  try {
    const { name, description, populerbrand, maincategory, status = "active" } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required."
      });
    }

    const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');

    // Construct image URL
    const img = `/uploads/brands/${req.file.filename}`;

    // Handle maincategory as array
    const maincategoryArray = Array.isArray(maincategory) ? maincategory :
      (maincategory ? [maincategory] : []);

    const brand = await BrandModel.create({
      name,
      slug,
      img,
      description: description || "",
      populerbrand: populerbrand === 'true' || populerbrand === true,
      maincategory: maincategoryArray,
      status
    });

    // Populate the main category details in response
    await brand.populate('maincategory');

    res.status(201).json({
      success: true,
      message: "Brand created successfully!",
      data: brand
    });

  } catch (error) {
    console.error("Create brand error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await BrandModel.find().populate('maincategory').sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error("Get brands error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// export const updateBrand = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, img, description, populerbrand, maincategory, status } = req.body;

//     const updateData = {};
//     if (name) {
//       updateData.name = name;
//       updateData.slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
//     }
//     if (img) updateData.img = img;
//     if (description !== undefined) updateData.description = description;
//     if (populerbrand !== undefined) updateData.populerbrand = populerbrand;
//     if (maincategory) updateData.maincategory = maincategory;
//     if (status) updateData.status = status;

//     const brand = await BrandModel.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('maincategory');

//     if (!brand) {
//       return res.status(404).json({
//         success: false,
//         message: "Brand not found."
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Brand updated successfully!",
//       data: brand
//     });

//   } catch (error) {
//     console.error("Update brand error:", error);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Brand with this name or slug already exists."
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };


export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, populerbrand, maincategory, status } = req.body;

    const updateData = {
      name,
      description: description || "",
      populerbrand: populerbrand === 'true' || populerbrand === true,
      status
    };

    // If name is being updated, update slug too
    if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
    }

    // Handle maincategory as array
    if (maincategory) {
      updateData.maincategory = Array.isArray(maincategory) ? maincategory : [maincategory];
    }

    // If new image is uploaded
    if (req.file) {
      updateData.img = `/uploads/brands/${req.file.filename}`;

      // Optional: Delete old image file
      // You might want to implement this to clean up storage
    }

    const brand = await BrandModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('maincategory');

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found."
      });
    }

    res.json({
      success: true,
      message: "Brand updated successfully!",
      data: brand
    });

  } catch (error) {
    console.error("Update brand error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await BrandModel.findByIdAndDelete(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully!",
      data: brand
    });

  } catch (error) {
    console.error("Delete brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Country CRUD
export const CreateCountries = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Flag image is required."
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-zA-Z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim(); // Remove any leading/trailing spaces

    // Construct image URL
    const img = `/uploads/countries/${req.file.filename}`;

    const country = await CountryModel.create({
      name,
      slug,
      img
    });

    res.status(201).json({
      success: true,
      message: "Country created successfully!",
      data: country
    });

  } catch (error) {
    console.error("Create country error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Country with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

export const getCountries = async (req, res) => {
  try {
    const countries = await CountryModel.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: countries
    });
  } catch (error) {
    console.error("Get countries error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// export const updateCountry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, img } = req.body;

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (img) updateData.img = img;

//     const country = await CountryModel.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!country) {
//       return res.status(404).json({
//         success: false,
//         message: "Country not found."
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Country updated successfully!",
//       data: country
//     });

//   } catch (error) {
//     console.error("Update country error:", error);
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Country with this name already exists."
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };


export const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updateData = { name };

    // If name is being updated, update slug too
    if (name) {
      updateData.slug = name.toLowerCase()
        .replace(/[^a-zA-Z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // If new image is uploaded
    if (req.file) {
      updateData.img = `/uploads/countries/${req.file.filename}`;
    }

    const country = await CountryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found."
      });
    }

    res.json({
      success: true,
      message: "Country updated successfully!",
      data: country
    });

  } catch (error) {
    console.error("Update country error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Country with this name or slug already exists."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};


export const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await CountryModel.findByIdAndDelete(id);

    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Country deleted successfully!",
      data: country
    });

  } catch (error) {
    console.error("Delete country error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};