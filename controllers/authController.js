const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

class AuthController {
  static async signup(req, res) {
    try {
      const { first_name, last_name, mobile_no, email, state, city, address, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByMobile(mobile_no);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      await User.create({
        first_name,
        last_name,
        mobile_no,
        email,
        state,
        city,
        address,
        password: hashedPassword,
        otp: null
      });

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { mobile_no, password } = req.body;
      // Find user
      const user = await User.findByMobile(mobile_no);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      // Prevent login if already logged in (token exists)
      if (user.token) {
        return res.status(400).json({ message: 'User is already logged in' });
      }
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      // Generate unique token
      const token = jwt.sign(
        { id: user.id, mobile: user.mobile_no, timestamp: Date.now() },
        process.env.JWT_SECRET
      );
      // Store token in database
      await User.updateToken(user.id, token);
      res.json({ user_id: user.id, token: token, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const userId = req.user.id;
      // Remove token from database
      await User.updateToken(userId, null);
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Add the missing methods below
  static async forgotPassword(req, res) {
    try {
      const { mobile_no } = req.body;
      
      // Find user
      const user = await User.findByMobile(mobile_no);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Generate OTP (6 digits)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in database
      await User.updateOtp(mobile_no, otp);
      
      // In a real application, you would send this OTP via SMS
      // For demo purposes, we're returning it in the response
      res.json({
        message: 'OTP generated successfully',
        otp: otp // In production, don't send this in response
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { mobile_no, otp, new_password } = req.body;
      
      // Find user
      const user = await User.findByMobile(mobile_no);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Verify OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      
      // Update password and clear OTP
      await User.updatePassword(mobile_no, hashedPassword);
      await User.updateOtp(mobile_no, null);
      
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;
      const userId = req.user.id;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(current_password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      
      // Update password
      await User.updatePassword(user.mobile_no, hashedPassword);
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;