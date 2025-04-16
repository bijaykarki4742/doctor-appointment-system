import mongoose from 'mongoose';
import { Appointment } from '../../models/Services/appointment.model.js';

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { userId, doctorId, date, timeSlot, reason } = req.body;

    // Validate required fields
    if (!userId || !doctorId || !date || !timeSlot || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Find patient by userId
    const patient = await mongoose.model('Patient').findOne({ user: userId });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Check if patient and doctor exist
    const doctor = await mongoose.model('Doctor').findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    
    // Create appointment
    const appointment = new Appointment({
      patientId :patient._id,
      doctorId,
      date,
      timeSlot,
      reason,
      amount: doctor.consultationFee || 0
    });

    await appointment.save();
    res.status(201).json(appointment);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all appointments (with filters)
export const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, status, date } = req.query;
    const filter = {};

    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'firstName lastName contact')
      .populate('doctorId', 'firstName lastName specialization');

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single appointment
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findById(id)
      .populate('patientId', 'firstName lastName contact')
      .populate('doctorId', 'firstName lastName specialization');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(updates);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    // Prevent updating patientId or doctorId
    if (updates.patientId || updates.doctorId) {
      return res.status(400).json({ error: 'Cannot change patient or doctor after creation' });
    }

    // If updating timeSlot, validate end > start
    if (updates.timeSlot?.end && updates.timeSlot?.start && 
        updates.timeSlot.end <= updates.timeSlot.start) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('patientId doctorId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add prescription to appointment
export const addPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { medications, instructions } = req.body;

    if (!medications || !Array.isArray(medications)) {
      return res.status(400).json({ error: 'Medications must be an array' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        prescription: { medications, instructions },
        status: 'completed' // Automatically mark as completed when adding prescription
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
