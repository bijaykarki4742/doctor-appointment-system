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
    origin: '*',
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
        httpServer.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });
