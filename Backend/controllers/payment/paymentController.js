import { Appointment } from '../../models/Services/appointment.model.js';

// Update payment status for an appointment
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, paymentAmount, paymentDate, transactionId } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }

    // Find the appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update payment information
    appointment.paymentStatus = paymentStatus || appointment.paymentStatus;
    appointment.paymentDetails = {
      ...appointment.paymentDetails,
      method: paymentMethod || appointment.paymentDetails?.method,
      amount: paymentAmount || appointment.paymentDetails?.amount,
      date: paymentDate || appointment.paymentDetails?.date,
      transactionId: transactionId || appointment.paymentDetails?.transactionId
    };

    // Save the updated appointment
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      appointment: {
        id: appointment._id,
        paymentStatus: appointment.paymentStatus,
        paymentDetails: appointment.paymentDetails
      }
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({
      error: 'Failed to update payment status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify eSewa payment (webhook handler)
export const verifyEsewaPayment = async (req, res) => {
  try {
    const { refId, amt, pid } = req.query;

    if (!refId || !amt || !pid) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // In a real implementation, you would verify the payment with eSewa's API
    // For UAT, we'll simulate a successful verification

    // Extract appointment ID from product ID (if using our convention)
    let appointmentId = null;
    if (pid.startsWith('APT-')) {
      appointmentId = pid.replace('APT-', '');
    }

    // If we have an appointment ID, update its payment status
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      
      if (appointment) {
        appointment.paymentStatus = 'paid';
        appointment.paymentDetails = {
          method: 'esewa',
          amount: amt,
          date: new Date(),
          transactionId: refId
        };
        
        await appointment.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { refId, amount: amt, productId: pid }
    });
  } catch (error) {
    console.error('Error verifying eSewa payment:', error);
    return res.status(500).json({
      error: 'Failed to verify payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
