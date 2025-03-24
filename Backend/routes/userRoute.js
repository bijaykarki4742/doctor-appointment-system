import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'User routes' });
});

router.get('/profile', authenticate, (req, res) => {
    res.json({ user: req.user });
});

export default router;