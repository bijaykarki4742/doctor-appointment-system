import express from 'express';
import { createReview } from '../controllers/review/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const reviewRouter = express.Router();

// Protected routes
reviewRouter.post('/',authenticate, createReview);
// reviewRouter.get('/', authenticate, getAppointments);
// reviewRouter.get('/:id', authenticate, getAppointmentById);
// reviewRouter.patch('/:id', authenticate, updateAppointment);
// reviewRouter.delete('/:id', authenticate, deleteAppointment);

// Special endpoints
// reviewRouter.patch('/:id/status', authenticate, updateAppointmentStatus);
// reviewRouter.post('/:id/prescription', authenticate, addPrescription);
// reviewRouter.post('/:id/prescription', authenticate, addPrescription);

export default reviewRouter;
