import express from 'express';
import { deleteDoctor, getCurrentDoctor, getDoctorById, getDoctors, updateDoctor } from '../controllers/doctor/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const doctorRoutes = express.Router();

doctorRoutes.get("/get", getDoctors);
doctorRoutes.get("/get/:id", getDoctorById);

doctorRoutes.put("/update/:id",authenticate, updateDoctor);
doctorRoutes.get("/me",authenticate, getCurrentDoctor);
doctorRoutes.delete("/delete/:id",authenticate, deleteDoctor);

export default doctorRoutes;