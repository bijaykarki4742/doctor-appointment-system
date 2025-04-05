import express from 'express';
import { login, signup } from '../controllers/authController.js';

const authrouter = express.Router();

authrouter.post('/signup',signup);
authrouter.post('/login',login);

export default authrouter;
