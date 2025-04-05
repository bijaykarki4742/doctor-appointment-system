import express from 'express';
import { deleteDoctor, getCurrentDoctor, getDoctorById, getDoctors, updateDoctor } from '../controllers/doctor/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const doctorRoutes = express.Router();

doctorRoutes.get("/get",authenticate, getDoctors);
doctorRoutes.get("/get/:id",authenticate, getDoctorById);
doctorRoutes.patch("/update/:id",authenticate, updateDoctor);
doctorRoutes.delete("/delete/:id",authenticate, deleteDoctor);

export default doctorRoutes;