import jwt, { decode } from 'jsonwebtoken';
import  User  from '../models/Entity/usermodel.js';

export const authenticate = async (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        console.log("Received Token in Middleware:", token);

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Before Verification:", decoded);

        // 3. Find user and attach to request
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error('Authentication Middleware Error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};