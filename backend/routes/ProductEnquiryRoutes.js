// routes/productEnquiryRoutes.js
import express from 'express';
import {
  createEnquiry,
  deleteEnquiry,
  getMyEnquiries,
  getEnquiryStats,
  getAllEnquiries,
  getAdminStats,
  updateEnquiryStatus
} from '../controllers/productController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';


const ProductEnquiryRouter = express.Router();

// Purchase User Routes
ProductEnquiryRouter.post('/enquiries', authenticateToken, createEnquiry);
ProductEnquiryRouter.get('/my', authenticateToken, getMyEnquiries);
ProductEnquiryRouter.get('/stats', authenticateToken, getEnquiryStats);
ProductEnquiryRouter.delete('/:id', authenticateToken, deleteEnquiry);

// Admin Routes
ProductEnquiryRouter.get('/admin/enquiries',   getAllEnquiries);
ProductEnquiryRouter.get('/admin/stats',   getAdminStats);
ProductEnquiryRouter.patch('/admin/:id/status',   updateEnquiryStatus);

export default ProductEnquiryRouter;