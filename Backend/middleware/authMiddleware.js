import jwt from 'jsonwebtoken';
import { User } from "../models/usermodel.js";

// middleware/auth.js
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);
        
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');
        next();

    } catch (error) {
        res.status(401).json({ error: 'Invalid/expired token' });
    }
};