import express from 'express';
import { login, signup } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const authrouter = express.Router();

authrouter.post('/signup',signup);
authrouter.post('/login',login);

authrouter.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default authrouter;
