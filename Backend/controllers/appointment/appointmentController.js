import mongoose from 'mongoose';
import { Appointment } from '../../models/Services/appointment.model.js';
import { v4 as uuidv4 } from 'uuid';

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

    // Check for existing appointment with same doctor, date, and time slot
    const existingAppointment = await Appointment.findOne({
      patientId: patient._id,
      doctorId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' } // exclude cancelled appointments
    });

    if (existingAppointment) {
      return res.status(409).json({
        error: 'You already have an appointment with this doctor at the selected time slot'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: patient._id,
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
    res.status(500).json({ error: 'Server error,Error in creating appointment' });
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

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    // Prevent updating patientId or doctorId
    if (updates.patientId || updates.doctorId) {
      return res.status(400).json({
        error: 'Cannot change patient or doctor after creation'
      });
    }

    // Handle timeSlot updates carefully
    if (updates.timeSlot) {
      const existingAppointment = await Appointment.findById(id);
      if (!existingAppointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Create a full timeSlot object combining existing and new values
      const fullTimeSlot = {
        start: updates.timeSlot.start || existingAppointment.timeSlot.start,
        end: updates.timeSlot.end || existingAppointment.timeSlot.end
      };

      // Validate the combined timeSlot
      if (fullTimeSlot.end <= fullTimeSlot.start) {
        return res.status(400).json({
          error: 'End time must be after start time'
        });
      }

      // Replace with the validated timeSlot
      updates.timeSlot = fullTimeSlot;
    }

    // Handle date validation if date is being updated
    if (updates.date) {
      const date = new Date(updates.date);
      if (date < new Date().setHours(0, 0, 0, 0)) {
        return res.status(400).json({
          error: 'Appointment date cannot be in the past'
        });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() }, // Explicitly update updatedAt
      { new: true, runValidators: true }
    ).populate('patientId doctorId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.message
      });
    }
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
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
// POST /appointments/start-call/:appointmentId
export const startVideoCall = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // If a roomId already exists, return it
    if (appointment.roomId) {
      return res.status(200).json({
        message: "Call already started",
        roomId: appointment.roomId,
      });
    }

    // Generate a new unique roomId
    const generatedRoomId = uuidv4();

    appointment.roomId = generatedRoomId;
    await appointment.save();

    res.status(200).json({
      message: "Room ID created",
      roomId: generatedRoomId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error starting video call" });
  }
};

// GET /appointments/get-room/:appointmentId
export const getRoomByAppointmentId = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (!appointment.roomId) {
      return res.status(204).json({ message: "Call not started yet" }); // No content
    }

    res.status(200).json({ roomId: appointment.roomId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting room ID" });
  }
};

