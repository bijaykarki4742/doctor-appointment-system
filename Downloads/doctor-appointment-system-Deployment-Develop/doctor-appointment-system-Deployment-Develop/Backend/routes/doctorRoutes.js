import express from 'express';
import { deleteDoctor, getDoctorById, getDoctors, updateDoctor } from '../controllers/doctor/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';
// import { createSchedule, getDoctorSchedule } from '../controllers/doctor/doctorScheduleController.js';
import {getAppointmentStats} from "../controllers/doctorStatsController.js";

const doctorRoutes = express.Router();

doctorRoutes.get("/get",authenticate, getDoctors);
doctorRoutes.get("/get/:id",authenticate, getDoctorById);
doctorRoutes.patch("/update/:id",authenticate, updateDoctor);
doctorRoutes.delete("/delete/:id",authenticate, deleteDoctor);
doctorRoutes.post('/stats/appointments', getAppointmentStats);

// doctorRoutes.post("/createMySchedule", authenticate,createSchedule);
// doctorRoutes.get("/myschedule", authenticate,getDoctorSchedule);

export default doctorRoutes;
