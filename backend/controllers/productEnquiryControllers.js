// controllers/productEnquiryController.js

import ProductEnquiryModel from "../models/ProductEnquiryModel.js";


// Create a new product enquiry
export const createEnquiry = async (req, res) => {
  try {
    const enquiry = new ProductEnquiryModel(req.body);
    await enquiry.save();
    res.status(201).json({ success: true, message: 'Enquiry created successfully', enquiry });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to create enquiry', error: error.message });
  }
};

// Get all enquiries
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await ProductEnquiryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries', error: error.message });
  }
};

// Get a single enquiry by ID
export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await ProductEnquiryModel.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch enquiry', error: error.message });
  }
};

// Update enquiry status or details
export const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await ProductEnquiryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Enquiry updated successfully', enquiry });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to update enquiry', error: error.message });
  }
};

// Delete an enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await ProductEnquiryModel.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to delete enquiry', error: error.message });
  }
};
