import express from 'express';
import { deletePatient, getAllPatients, getPatientById, updatePatient } from '../controllers/patient/patientController.js';

const userRoutes = express.Router();

userRoutes.get('/getAllpatients',getAllPatients);
userRoutes.get('/getPatientById/:id',getPatientById);
userRoutes.patch('/update/:id',updatePatient); 
userRoutes.delete('/delete/:id',deletePatient); 

export default userRoutes;
