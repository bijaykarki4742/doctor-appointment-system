import mongoose from "mongoose";

const DoctorScheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  breakTimes: [{
    start: String,
    end: String
  }],
  appointmentDuration: {
    type: Number,
    default: 30 // in minutes
  },
  maxPatients: {
    type: Number,
    default: 10
  },
  recurring: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

DoctorScheduleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});