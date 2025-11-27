// controllers/productController.js
import ProductEnquiry from '../models/ProductEnquiry.js';
import BusinessRegistration from '../models/BusinessRegistration.js';

// Purchase User Controllers
export const createEnquiry = async (req, res) => {
  try {
    const { productName, description, quantity } = req.body;

    const business = await BusinessRegistration.findById(req.userId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    const enquiry = new ProductEnquiry({
      businessId: req.userId,
      productName,
      description,
      quantity,
      email: business.email,
      phone: business.phone,
      Name: `${business.firstName} ${business.lastName}`,
      companyName: business.companyName
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry created successfully',
      data: enquiry
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await ProductEnquiry.find({ businessId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: enquiries
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await ProductEnquiry.findOneAndDelete({
      _id: id,
      businessId: req.userId
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getEnquiryStats = async (req, res) => {
  try {
    const [total, pending, processing, completed, cancelled] = await Promise.all([
      ProductEnquiry.countDocuments({ businessId: req.userId }),
      ProductEnquiry.countDocuments({ businessId: req.userId, status: 'pending' }),
      ProductEnquiry.countDocuments({ businessId: req.userId, status: 'processing' }),
      ProductEnquiry.countDocuments({ businessId: req.userId, status: 'completed' }),
      ProductEnquiry.countDocuments({ businessId: req.userId, status: 'cancelled' })
    ]);

    const stats = { total, pending, processing, completed, cancelled };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Admin Controllers
export const getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const enquiries = await ProductEnquiry.find(query)
      .populate('businessId', 'firstName lastName companyName email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await ProductEnquiry.countDocuments(query);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEnquiries: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching all enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [total, pending, processing, completed, cancelled, totalBusinesses] = await Promise.all([
      ProductEnquiry.countDocuments(),
      ProductEnquiry.countDocuments({ status: 'pending' }),
      ProductEnquiry.countDocuments({ status: 'processing' }),
      ProductEnquiry.countDocuments({ status: 'completed' }),
      ProductEnquiry.countDocuments({ status: 'cancelled' }),
      BusinessRegistration.countDocuments({ role: 'purchase' })
    ]);

    // Recent enquiries (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentEnquiries = await ProductEnquiry.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    const stats = { 
      total, 
      pending, 
      processing, 
      completed, 
      cancelled, 
      totalBusinesses,
      recentEnquiries 
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const enquiry = await ProductEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('businessId', 'firstName lastName companyName email phone');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry status updated successfully',
      data: enquiry
    });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};