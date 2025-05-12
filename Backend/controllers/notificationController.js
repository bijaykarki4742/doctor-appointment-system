// controllers/notificationController.js
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Configure services
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendAppointmentNotification = async (req, res) => {
  const { appointmentDetails, patientInfo } = req.body;

  // console.log('Appointment Details:', appointmentDetails);
  // console.log('Patient Info:', patientInfo);

  try {
    // Send email notification
    await sendEmailNotification(appointmentDetails, patientInfo);
    
    
    res.status(200).json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};

async function sendEmailNotification(appointment, patient) {
  const msg = {
    to:process.env.EMAIL_FROM ,
    from: process.env.EMAIL_FROM,
    subject: `Appointment Confirmation - ${appointment.doctor.name}`,
    html: `
      <h2>Your appointment has been confirmed!</h2>
      <p><strong>Doctor:</strong> ${appointment.doctor.name} (${appointment.doctor.specialty})</p>
      <p><strong>Date:</strong> ${appointment.date}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p>Please arrive 15 minutes before your scheduled time.</p>
    `,
  };
  await sgMail.send(msg)
  .catch((error) => {
    console.error('Email error:', error);
    throw new Error('Failed to send email notification');
  });
  console.log('Email sent successfully to:', patient.email);
}