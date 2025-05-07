// index.js
import express from 'express';
import { createServer } from 'http';
import connectDB from './config/database.js';
import cors from 'cors';
import router from './routes/indexRoute.js';
import { setupSocket } from './Socket.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/', router);

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
setupSocket(httpServer);

// Connect to database and start server
connectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });
