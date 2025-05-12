// import mongoose from "mongoose";

// const DoctorScheduleSchema = new mongoose.Schema({
//   doctorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Doctor',
//     required: [true, 'Doctor ID is required'],
//   },
//   dayOfWeek: {
//     type: Number,
//     required: [true, 'Day of week is required'],
//     min: [0, 'Day of week must be between 0 (Sunday) and 6 (Saturday)'],
//     max: [6, 'Day of week must be between 0 (Sunday) and 6 (Saturday)']
//   },
//   startTime: {
//     type: String,
//     required: [true, 'Start time is required'],
//     validate: {
//       validator: function(v) {
//         return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
//       },
//       message: props => `${props.value} is not a valid time format (HH:MM)`
//     }
//   },
//   endTime: {
//     type: String,
//     required: [true, 'End time is required'],
//     validate: [
//       {
//         validator: function(v) {
//           return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
//         },
//         message: props => `${props.value} is not a valid time format (HH:MM)`
//       },
//       {
//         validator: function(v) {
//           return this.startTime && v > this.startTime;
//         },
//         message: 'End time must be after start time'
//       }
//     ]
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   breakTimes: [{
//     start: {
//       type: String,
//       required: [true, 'Break start time is required'],
//       validate: {
//         validator: function(v) {
//           return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
//         },
//         message: props => `${props.value} is not a valid time format (HH:MM)`
//       }
//     },
//     end: {
//       type: String,
//       required: [true, 'Break end time is required'],
//       validate: [
//         {
//           validator: function(v) {
//             return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
//           },
//           message: props => `${props.value} is not a valid time format (HH:MM)`
//         },
//         {
//           validator: function(v) {
//             return this.start && v > this.start;
//           },
//           message: 'Break end time must be after break start time'
//         },
//         {
//           validator: function(v) {
//             const scheduleStart = this.parent().startTime;
//             const scheduleEnd = this.parent().endTime;
//             return v >= scheduleStart && v <= scheduleEnd;
//           },
//           message: 'Break time must be within schedule hours'
//         }
//       ]
//     }
//   }],
//   appointmentDuration: {
//     type: Number,
//     default: 30,
//     min: [5, 'Appointment duration cannot be less than 5 minutes'],
//     max: [30, 'Appointment duration cannot exceed 30 minutes'],
//     validate: {
//       validator: function(v) {
//         return v % 5 === 0;
//       },
//       message: 'Appointment duration must be in 5-minute increments'
//     }
//   },
//   maxPatients: {
//     type: Number,
//     default: 10,
//     min: [0, 'can have 0 patient slot'],
//     max: [10, 'Cannot exceed 10 patients per schedule']
//   },
//   recurring: {
//     type: Boolean,
//     default: true
//   },
//   validFrom: {
//     type: Date,
//     default: Date.now,
//     validate: {
//       validator: function(v) {
//         return !this.validTo || v <= this.validTo;
//       },
//       message: 'Valid from date must be before or equal to valid to date'
//     }
//   },
//   validTo: {
//     type: Date,
//     validate: {
//       validator: function(v) {
//         return v >= this.validFrom;
//       },
//       message: 'Valid to date must be after or equal to valid from date'
//     }
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     immutable: true
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Middleware to validate break times don't overlap
// DoctorScheduleSchema.pre('save', function(next) {
//   if (this.breakTimes && this.breakTimes.length > 1) {
//     // Sort break times by start time
//     const sortedBreaks = [...this.breakTimes].sort((a, b) => a.start.localeCompare(b.start));
    
//     for (let i = 1; i < sortedBreaks.length; i++) {
//       if (sortedBreaks[i].start < sortedBreaks[i-1].end) {
//         throw new Error(`Break times cannot overlap: ${sortedBreaks[i-1].start}-${sortedBreaks[i-1].end} overlaps with ${sortedBreaks[i].start}-${sortedBreaks[i].end}`);
//       }
//     }
//   }
  
//   // Validate total working hours
//   const start = new Date(`1970-01-01T${this.startTime}:00`);
//   const end = new Date(`1970-01-01T${this.endTime}:00`);
//   const totalMinutes = (end - start) / (1000 * 60);
  
//   if (totalMinutes <= 0) {
//     throw new Error('Total working hours must be positive');
//   }
  
//   this.updatedAt = Date.now();
//   next();
// });

// // Additional validation for schedule conflicts
// DoctorScheduleSchema.pre('save', async function(next) {
//   if (this.isNew || this.isModified('doctorId') || this.isModified('dayOfWeek') || 
//       this.isModified('startTime') || this.isModified('endTime') || this.isModified('validFrom') || 
//       this.isModified('validTo')) {
    
//     const conflictingSchedules = await mongoose.model('DoctorSchedule').find({
//       doctorId: this.doctorId,
//       dayOfWeek: this.dayOfWeek,
//       $or: [
//         {
//           validFrom: { $lte: this.validTo || new Date('9999-12-31') },
//           validTo: { $gte: this.validFrom }
//         },
//         {
//           validFrom: { $gte: this.validFrom },
//           validTo: { $lte: this.validTo || new Date('9999-12-31') }
//         }
//       ],
//       _id: { $ne: this._id }
//     });
    
//     for (const schedule of conflictingSchedules) {
//       const newStart = this.startTime;
//       const newEnd = this.endTime;
//       const existingStart = schedule.startTime;
//       const existingEnd = schedule.endTime;
      
//       if ((newStart >= existingStart && newStart < existingEnd) ||
//           (newEnd > existingStart && newEnd <= existingEnd) ||
//           (newStart <= existingStart && newEnd >= existingEnd)) {
//         throw new Error(`Schedule conflicts with existing schedule (${existingStart}-${existingEnd})`);
//       }
//     }
//   }
//   next();
// });

// export const DoctorSchedule = mongoose.model('DoctorSchedule', DoctorScheduleSchema);