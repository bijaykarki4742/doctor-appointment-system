// routes/payment.js
import { Router } from 'express';
const router = Router();

// Create payment order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, appointmentDetails } = req.body;
        
        // Generate unique payment ID
        const paymentId = `PAY-${Date.now()}`;
        
        // Save temporary payment record (optional)
        const paymentData = {
            paymentId,
            amount,
            status: 'pending',
            appointmentDetails
        };
        
        // In production, save to database
        // const payment = await Payment.create(paymentData);
        
        res.json({
            success: true,
            paymentId,
            amount,
            taxAmount: 0, // Set based on your requirements
            serviceCharge: 0, // Set based on your requirements
            deliveryCharge: 0, // Set based on your requirements
            totalAmount: amount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Verify payment (callback from eSewa)
router.post('/verify', async (req, res) => {
    try {
        const { oid, amt, refId } = req.body;
        
        // Verify payment with eSewa API (in production)
        // For test environment, we'll just simulate success
        const verificationSuccess = true;
        
        if (verificationSuccess) {
            // Update payment status in database
            // await Payment.updateOne({ paymentId: oid }, { status: 'completed', eSewaRefId: refId });
            
            // Create appointment
            // const payment = await Payment.findOne({ paymentId: oid });
            // const appointment = await Appointment.create({
            //     ...payment.appointmentDetails,
            //     paymentStatus: 'paid',
            //     paymentMethod: 'esewa'
            // });
            
            return res.redirect(`${process.env.FRONTEND_URL}/appointment/success?refId=${refId}`);
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/appointment/failure?reason=payment_failed`);
        }
    } catch (error) {
        console.error('Payment verification failed:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/appointment/failure?reason=error`);
    }
});

export default router;