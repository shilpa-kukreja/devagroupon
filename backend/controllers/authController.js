
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import BusinessRegistration from '../models/BusinessRegistration.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Configure email transporter (update with your email service details)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Login Business
export const loginBusiness = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Find business by email
    const business = await BusinessRegistration.findOne({ email });
    if (!business) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Check if business is approved
    if (business.status !== 'Approved') {
      return res.status(401).json({
        success: false,
        message: "Your account is pending approval. Please contact administrator."
      });
    }

    console.log("Login attempt -> email:", email);
    console.log("Password from frontend:", password);
    console.log("Stored password in DB:", business.password);


    // Verify password
    const isPasswordValid = await bcrypt.compare(password, business.password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate token
    const token = generateToken(business._id, business.role);

    // Prepare user data for response
    const userData = {
      id: business._id,
      companyName: business.companyName,
      firstName: business.firstName,
      lastName: business.lastName,
      email: business.email,
      role: business.role,
      status: business.status
    };

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: userData,
      expiresIn: rememberMe ? '30d' : '1d'
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Forgot Password - Send Reset Email




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required."
      });
    }

    const business = await BusinessRegistration.findOne({ email });
    if (!business) {
      // Don't reveal if email exists for security
      return res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent."
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: business._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/frontend/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: `"Beagley Copperman" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Beagley Copperman',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
                .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                    <p>Beagley Copperman Business Portal</p>
                </div>
                <div class="content">
                    <h2>Hello,</h2>
                    <p>You are receiving this email because you requested a password reset for your Beagley Copperman business account.</p>
                    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" class="button">Reset Your Password</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 12px;">${resetLink}</p>
                    <p>If you didn't request this reset, please ignore this email. Your password will remain unchanged.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Beagley Copperman. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to: ${email}`);

      res.status(200).json({
        success: true,
        message: "If the email exists, a password reset link has been sent.",
      });

    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required."
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token."
      });
    }

    // Find user and update password
    const business = await BusinessRegistration.findById(decoded.userId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    business.password = hashedPassword;
    await business.save();

    // Send confirmation email
    const mailOptions = {
      from: `"Beagley Copperman" <${process.env.EMAIL_USER}>`,
      to: business.email,
      subject: 'Password Reset Successful - Beagley Copperman',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; }
                .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Successful</h1>
                </div>
                <div class="content">
                    <h2>Hello ${business.businessName || 'Valued Customer'},</h2>
                    <p>Your password has been successfully reset.</p>
                    <p>If you did not make this change, please contact our support team immediately.</p>
                    <p>You can now login to your account with your new password.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Beagley Copperman. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Confirmation email sending failed:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Password reset successfully!"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get Current User Profile
export const getProfile = async (req, res) => {
  try {
    const business = await BusinessRegistration.findById(req.userId).select('-password');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.status(200).json({
      success: true,
      user: business
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};