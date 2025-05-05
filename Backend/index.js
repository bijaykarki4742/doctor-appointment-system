import express from 'express';
import connectDB from './config/database.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/indexRoute.js';
import {setupSocket} from "./Socket.js";
import * as http from "node:http";
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

const app = express();
const server = http.createServer(app);
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
    methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"],
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
            setupSocket(server);
        })
    })
    .catch(() => {
        console.log("Connection failed");
    })

export default app;
