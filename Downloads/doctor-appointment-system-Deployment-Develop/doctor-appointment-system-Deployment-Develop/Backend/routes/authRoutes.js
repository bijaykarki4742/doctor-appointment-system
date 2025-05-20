import express from 'express';
import bcrypt from 'bcryptjs'; // For hashing the password
import User from '../models/Entity/usermodel.js';
import { forgotPassword } from '../controllers/forgotPassword.js';
import { login, signup } from '../controllers/authController.js';
import { resetPassword } from '../controllers/resetPassword.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password', resetPassword);

// POST /api/auth/register (same as signup but using the password hashing)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
