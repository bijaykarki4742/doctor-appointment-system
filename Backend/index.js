// index.js
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import fs from 'fs';
import cors from 'cors';
// import connectDB from './config/database.js';
import router from './routes/indexRoute.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/database.js';
import { setupSocket } from './Socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/', router);
app.use('/verification-images', express.static(path.join(__dirname, 'uploads/verifications')));
app.use('/profile-pictures', express.static(path.join(__dirname, 'uploads/profile-pictures')));
// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
setupSocket(httpServer);

// Connect to database and start server
connectDB()
    .then(() => {
        httpServer.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });
