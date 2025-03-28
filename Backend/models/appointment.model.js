import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true,
    required: true,
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
      required: true
    },
    end: {
      type: String,
      required: true,
      validate: {
        validator: function (endTime) {
          return endTime > this.timeSlot.start;
        },
        message: 'End time must be after start time'
      }
    }
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: String,
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
    min: 0
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