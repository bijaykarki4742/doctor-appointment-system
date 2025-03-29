import express from 'express';
import connectDB from './config/database.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/indexRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true 
}))

// Routes
app.use('/',router);

// Connect to database
connectDB().
    then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        })
    })
    .catch(() => {
        console.log("Connection failed");
    })

export default app;
