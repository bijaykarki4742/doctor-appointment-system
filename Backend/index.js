import express from 'express';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
app.use('/api/users', userRoutes);


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

