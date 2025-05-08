import express from 'express';
import { updatePaymentStatus, verifyEsewaPayment } from '../controllers/payment/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

// Update payment status for an appointment
paymentRouter.patch('/:id', authenticate, updatePaymentStatus);

// Verify eSewa payment (webhook)
paymentRouter.get('/verify/esewa', verifyEsewaPayment);

export default paymentRouter;
