import express from 'express';
import {createPatient, getCurrentPatient, deletePatient, getPatientById, getPatients, updatePatient } from '../controllers/patient/patientController.js';
import { authenticate } from '../middleware/authMiddleware.js';
const patientRoutes = express.Router();

patientRoutes.post("/add", createPatient);
patientRoutes.get("/get", getPatients);
patientRoutes.get("/get/:id", getPatientById);

patientRoutes.put("/update/:id",authenticate, updatePatient);
patientRoutes.get("/me",authenticate, getCurrentPatient);
patientRoutes.delete("/delete/:id",authenticate, deletePatient);

export default patientRoutes;