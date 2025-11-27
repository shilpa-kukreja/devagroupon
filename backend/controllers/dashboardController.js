import CategoryModel from "../models/CategoryModel.js";
import Contact from "../models/contactModels.js";
import MainCategoryModel from "../models/MainCategoryModel.js";
import Newsletter from "../models/newsletterModels.js";
import ProductEnquiryModel from "../models/ProductEnquiryModel.js";
import Product from "../models/ProductModel.js";
import SubcategoryModel from "../models/SubcategoryModel.js";


// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalEnquiries,
      pendingEnquiries,
      completedEnquiries,
      totalMainCategories,
      totalSubCategories,
      totalContacts,
      unreadContacts,
      totalSubscribers,
      activeSubscribers
    ] = await Promise.all([
      Product.countDocuments(),
      CategoryModel.countDocuments(),
      ProductEnquiryModel.countDocuments(),
      ProductEnquiryModel.countDocuments({ status: 'pending' }),
      ProductEnquiryModel.countDocuments({ status: 'completed' }),
      MainCategoryModel.countDocuments(),
      SubcategoryModel.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Newsletter.countDocuments(),
      Newsletter.countDocuments({ status: 'active' })
    ]);

    // Get recent enquiries (without populate since product field doesn't exist)
    const recentEnquiries = await ProductEnquiryModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productName email status createdAt');

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    // Get enquiries by status (for chart)
    const enquiriesByStatus = await ProductEnquiryModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get contacts by status
    const contactsByStatus = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get subscriber growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const subscriberGrowth = await Newsletter.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get monthly enquiries for chart
    const monthlyEnquiries = await ProductEnquiryModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get monthly contacts for chart
    const monthlyContacts = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          products: totalProducts,
          categories: totalCategories + totalMainCategories + totalSubCategories,
          enquiries: totalEnquiries,
          contacts: totalContacts,
          subscribers: totalSubscribers
        },
        breakdown: {
          pendingEnquiries,
          completedEnquiries,
          unreadContacts,
          activeSubscribers,
          mainCategories: totalMainCategories,
          subCategories: totalSubCategories
        },
        recentEnquiries,
        recentContacts,
        charts: {
          enquiriesByStatus,
          contactsByStatus,
          subscriberGrowth,
          monthlyEnquiries,
          monthlyContacts
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

// Get chart data
export const getDashboardCharts = async (req, res) => {
  try {
    // Products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: {
          path: '$categoryInfo',
          preserveNullAndEmptyArrays: true // Handle products without categories
        }
      },
      {
        $project: {
          name: { $ifNull: ['$categoryInfo.name', 'Uncategorized'] },
          count: 1
        }
      }
    ]);

    // Enquiries by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const enquiriesByMonth = await ProductEnquiryModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Contacts by month
    const contactsByMonth = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Subscribers by status
    const subscribersByStatus = await Newsletter.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Products by main category
    const productsByMainCategory = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: {
          path: '$categoryInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'maincategories',
          localField: 'categoryInfo.mainCategory',
          foreignField: '_id',
          as: 'mainCategoryInfo'
        }
      },
      {
        $unwind: {
          path: '$mainCategoryInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$mainCategoryInfo._id',
          name: { $first: '$mainCategoryInfo.name' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: { $ifNull: ['$name', 'Uncategorized'] },
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        productsByCategory,
        enquiriesByMonth,
        contactsByMonth,
        subscribersByStatus,
        productsByMainCategory
      }
    });
  } catch (error) {
    console.error('Dashboard charts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chart data'
    });
  }
};

// Get overview data for dashboard cards
export const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalProducts,
      totalEnquiries,
      totalContacts,
      totalSubscribers,
      pendingEnquiries,
      unreadContacts
    ] = await Promise.all([
      Product.countDocuments(),
      ProductEnquiryModel.countDocuments(),
      Contact.countDocuments(),
      Newsletter.countDocuments(),
      ProductEnquiryModel.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'unread' })
    ]);

    // Calculate growth percentages (you can modify this to compare with previous period)
    // For now, using static values - you can implement actual growth calculation
    const growthData = {
      products: 12, // Example: 12% growth
      enquiries: 8,
      contacts: 15,
      subscribers: 25
    };

    res.json({
      success: true,
      data: {
        totals: {
          products: totalProducts,
          enquiries: totalEnquiries,
          contacts: totalContacts,
          subscribers: totalSubscribers
        },
        pending: {
          enquiries: pendingEnquiries,
          contacts: unreadContacts
        },
        growth: growthData
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview'
    });
  }
};