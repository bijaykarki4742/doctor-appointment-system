import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function (date) {
        return date >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  timeSlot: {
    start: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format (HH:mm)']
    },
    end: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format (HH:mm)'],
      validate: {
        validator: function (endTime) {
          if (!this.start) return true; // Skip if start is missing (handled by 'required')
          
          // Convert "HH:mm" to total minutes for comparison
          const [startHours, startMins] = this.start.split(':').map(Number);
          const [endHours, endMins] = endTime.split(':').map(Number);
          
          const startTotal = startHours * 60 + startMins;
          const endTotal = endHours * 60 + endMins;
          
          return endTotal > startTotal;
        },
        message: 'End time must be after start time'
      }
    }
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'completed', 'cancelled', 'no-show'],
      message: 'Invalid status value'
    },
    default: 'scheduled'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }],
    instructions: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    min: [0, 'Amount cannot be negative'],
    validate: {
      validator: function (value) {
        return Number.isFinite(value);
      },
      message: 'Amount must be a valid number'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

AppointmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


const Appointment = mongoose.model('Appointment',AppointmentSchema);

export { Appointment}