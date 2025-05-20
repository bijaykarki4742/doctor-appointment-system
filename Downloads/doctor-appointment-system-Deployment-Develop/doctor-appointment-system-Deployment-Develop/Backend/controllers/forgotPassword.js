import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/Entity/usermodel.js';
import dotenv from 'dotenv';
dotenv.config();

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    

    const message = {
      from: 'no-reply@example.com',
      to: user.email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for resetting password is: ${otp}. It will expire in 10 minutes.`
    };

    const info = await transporter.sendMail(message);

    console.log('✉️ Email preview URL:', nodemailer.getTestMessageUrl(info));

    res.status(200).json({
      message: 'OTP sent to your email',
      preview: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
