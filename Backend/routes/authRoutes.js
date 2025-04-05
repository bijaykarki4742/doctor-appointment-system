import express from 'express';
import { Router } from 'express';
import { User } from '../models/usermodel.js';
import bcrypt from 'bcryptjs';  
import jwt from 'jsonwebtoken'; // Add this line at the top


const router = express.Router();

router.get('/', (req, res) => {
    res.send("Mel World ");
  });

// Signup route
router.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, contact, specialty, license } = req.body;

    // Validate if all required fields are present
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contact: role === 'Doctor' ? contact : '',
      specialty: role === 'Doctor' ? specialty : '',
      license: role === 'Doctor' ? license : '',
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    // Handle any server errors
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token (you should store this token on the client side and send it with requests that require authentication)
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with a success message and the token
    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    // Handle any server errors
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
