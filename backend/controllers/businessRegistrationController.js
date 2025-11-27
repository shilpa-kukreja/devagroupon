
import BusinessRegistration from "../models/BusinessRegistration.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

// @route POST /api/business/register
export const registerBusiness = async (req, res) => {
  try {
    const businessData = req.body;

    // Validate required fields
    if (
      !businessData.companyName ||
      !businessData.businessType ||
      !businessData.vatNumber ||
      !businessData.firstName ||
      !businessData.lastName ||
      !businessData.email ||
      !businessData.phone ||
      !businessData.password || // include password validation
      !businessData.street ||
      !businessData.postalCode ||
      !businessData.city ||
      !businessData.country
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Check if email already exists
    const existingBusiness = await BusinessRegistration.findOne({ email: businessData.email });
    if (existingBusiness) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(businessData.password, salt);

    // Replace plain password with hashed version
    businessData.password = hashedPassword;

    // Create new business
    const newBusiness = await BusinessRegistration.create(businessData);

    res.status(201).json({
      success: true,
      message: "Business registered successfully!",
      data: newBusiness,
    });
  } catch (error) {
    console.error("Error registering business:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// @desc Get all registered businesses (for admin)
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await BusinessRegistration.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc Get a single business by ID
export const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await BusinessRegistration.findById(id);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc Delete a business (optional for admin use)
export const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BusinessRegistration.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }
    res.status(200).json({ success: true, message: "Business deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// @desc Update business status
export const updateBusinessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const business = await BusinessRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

















// @desc Admin login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      return res.status(200).json({ success: true, token })
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

