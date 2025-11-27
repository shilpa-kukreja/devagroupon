import express from 'express';
import { forgotPassword, getProfile, loginBusiness, resetPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';



const authRouter = express.Router();

authRouter.post('/login', loginBusiness);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/profile', authenticateToken, getProfile);

export default authRouter;