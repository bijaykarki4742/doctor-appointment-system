import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// Configure services
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { appointmentDetails, patientInfo } = req.body;

  try {
    // Send email notification
    await sendEmailNotification(appointmentDetails, patientInfo);
    
    // Send SMS notification
    await sendSMSNotification(appointmentDetails, patientInfo);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
}

async function sendEmailNotification(appointment, patient) {
  const msg = {
    to: patient.email,
    from: process.env.EMAIL_FROM, // Your verified sender
    subject: `Appointment Confirmation - ${appointment.doctor.name}`,
    html: `
      <h2>Your appointment has been confirmed!</h2>
      <p><strong>Doctor:</strong> ${appointment.doctor.name} (${appointment.doctor.specialty})</p>
      <p><strong>Date:</strong> ${appointment.date}</p>
      <p><strong>Time:</strong> ${appointment.time}</p>
      <p>Please arrive 15 minutes before your scheduled time.</p>
      <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
    `,
  };

  await sgMail.send(msg);
}

async function sendSMSNotification(appointment, patient) {
  await twilioClient.messages.create({
    body: `Your appointment with Dr. ${appointment.doctor.name} is confirmed for ${appointment.date} at ${appointment.time}. Reply STOP to unsubscribe.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: patient.phone,
  });
}