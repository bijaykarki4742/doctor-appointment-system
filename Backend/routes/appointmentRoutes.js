import express from 'express';
import {
    addPrescription,
    createAppointment,
    deleteAppointment,
    getAppointmentById,
    getAppointments,
    getRoomByAppointmentId, startVideoCall,
    updateAppointment,
    updateAppointmentStatus,

} from '../controllers/appointment/appointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
// import VideoCallRouter from "./VideoCallRoutes.js";


const appointmentRouter = express.Router();

// Protected routes
appointmentRouter.post('/', authenticate, createAppointment);
appointmentRouter.get('/', authenticate, getAppointments);
appointmentRouter.get('/:id', authenticate, getAppointmentById);
appointmentRouter.patch('/:id', authenticate, updateAppointment);
appointmentRouter.delete('/:id', authenticate, deleteAppointment);

// Special endpoints
appointmentRouter.patch('/:id/status', authenticate, updateAppointmentStatus);
appointmentRouter.post('/:id/prescription', authenticate, addPrescription);
// appointmentRouter.post('/:id/prescription', authenticate, addPrescription);

appointmentRouter.get("/get-room/:appointmentId", getRoomByAppointmentId);
appointmentRouter.post("/start-call/:appointmentId", startVideoCall);

export default appointmentRouter;
