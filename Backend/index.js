import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/indexRoute.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/database.js';
import { setupSocket } from './Socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/', router);

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
setupSocket(httpServer);

// ✅ Use only this for DB connection
connectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });
