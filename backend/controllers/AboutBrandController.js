// controllers/aboutBrandController.js

import AboutBrandModel from "../models/AboutBrandModel.js";

// Create About Brand section
export const createAboutBrand = async (req, res) => {
  try {
    const { heading, content, color, brand, sectionType, order, status } = req.body;

    if (!heading || !content || !brand || !sectionType) {
      return res.status(400).json({
        success: false,
        message: "Heading, content, brand, and section type are required."
      });
    }

    // Check if section type already exists for this brand
    const existingSection = await AboutBrandModel.findOne({ 
      brand, 
      sectionType 
    });

    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: `Section type '${sectionType}' already exists for this brand.`
      });
    }

    const aboutBrandData = {
      heading,
      content,
      color: color || "",
      brand,
      sectionType,
      order: order || 0,
      status: status || 'active'
    };

    // If image is uploaded
    if (req.file) {
      aboutBrandData.image = `/uploads/aboutbrand/${req.file.filename}`;
    }

    const aboutBrand = await AboutBrandModel.create(aboutBrandData);

    console.log(aboutBrand);

    // Populate brand details
    await aboutBrand.populate('brand');

    res.status(201).json({
      success: true,
      message: "About brand section created successfully!",
      data: aboutBrand
    });

  } catch (error) {
    console.error("Create about brand error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Section type already exists for this brand."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get all About Brand sections
export const getAllAboutBrands = async (req, res) => {
  try {
    const aboutBrands = await AboutBrandModel.find()
      .populate('brand')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: aboutBrands
    });

  } catch (error) {
    console.error("Get about brands error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get About Brand sections by brand ID
export const getAboutBrandsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const aboutBrands = await AboutBrandModel.find({ brand: brandId, status: 'active' })
      .populate('brand')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: aboutBrands
    });

  } catch (error) {
    console.error("Get about brands by brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get single About Brand section
export const getAboutBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutBrand = await AboutBrandModel.findById(id).populate('brand');

    if (!aboutBrand) {
      return res.status(404).json({
        success: false,
        message: "About brand section not found."
      });
    }

    res.json({
      success: true,
      data: aboutBrand
    });

  } catch (error) {
    console.error("Get about brand by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Update About Brand section
export const updateAboutBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, content, color, brand, sectionType, order, status } = req.body;

    const aboutBrand = await AboutBrandModel.findById(id);

    if (!aboutBrand) {
      return res.status(404).json({
        success: false,
        message: "About brand section not found."
      });
    }

    const updateData = {
      heading: heading || aboutBrand.heading,
      content: content || aboutBrand.content,
      color: color !== undefined ? color : aboutBrand.color,
      order: order !== undefined ? order : aboutBrand.order,
      status: status || aboutBrand.status
    };

    // If brand or sectionType is being updated, check for duplicates
    if (brand && brand !== aboutBrand.brand.toString()) {
      updateData.brand = brand;
    }

    if (sectionType && sectionType !== aboutBrand.sectionType) {
      updateData.sectionType = sectionType;
      
      // Check for duplicate section type
      const existingSection = await AboutBrandModel.findOne({
        brand: updateData.brand || aboutBrand.brand,
        sectionType,
        _id: { $ne: id }
      });

      if (existingSection) {
        return res.status(400).json({
          success: false,
          message: `Section type '${sectionType}' already exists for this brand.`
        });
      }
    }

    // If new image is uploaded
    if (req.file) {
      updateData.image = `/uploads/aboutbrand/${req.file.filename}`;
    }

    const updatedAboutBrand = await AboutBrandModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('brand');

    res.json({
      success: true,
      message: "About brand section updated successfully!",
      data: updatedAboutBrand
    });

  } catch (error) {
    console.error("Update about brand error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Section type already exists for this brand."
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Delete About Brand section
export const deleteAboutBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutBrand = await AboutBrandModel.findByIdAndDelete(id);

    if (!aboutBrand) {
      return res.status(404).json({
        success: false,
        message: "About brand section not found."
      });
    }

    res.json({
      success: true,
      message: "About brand section deleted successfully!"
    });

  } catch (error) {
    console.error("Delete about brand error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get About Brand sections by section type
export const getAboutBrandsBySectionType = async (req, res) => {
  try {
    const { sectionType } = req.params;

    const aboutBrands = await AboutBrandModel.find({ 
      sectionType, 
      status: 'active' 
    })
      .populate('brand')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: aboutBrands
    });

  } catch (error) {
    console.error("Get about brands by section type error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};