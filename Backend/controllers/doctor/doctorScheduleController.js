// import mongoose from 'mongoose';
// import { DoctorSchedule } from '../models/DoctorSchedule.model.js';
// import { Appointment } from '../models/Appointment.model.js';
// import { format, parse, addMinutes, isBefore, isAfter, isEqual, getDay } from 'date-fns';

// // Create new schedule (POST)
// export const createSchedule = async (req, res) => {
//     try {
//         const { doctorId, dayOfWeek, startTime, endTime, breakTimes, appointmentDuration, maxPatients } = req.body;

//         // Validate required fields
//         if (!doctorId || dayOfWeek === undefined || !startTime || !endTime) {
//             return res.status(400).json({ error: 'Doctor ID, dayOfWeek, startTime and endTime are required' });
//         }

//         // Validate doctor exists
//         const doctor = await mongoose.model('Doctor').findById(doctorId);
//         if (!doctor) {
//             return res.status(404).json({ error: 'Doctor not found' });
//         }

//         // Create new schedule
//         const newSchedule = new DoctorSchedule({
//             doctorId,
//             dayOfWeek,
//             startTime,
//             endTime,
//             breakTimes: breakTimes || [],
//             appointmentDuration: appointmentDuration || 30,
//             maxPatients: maxPatients || 10
//         });

//         await newSchedule.save();
//         res.status(201).json(newSchedule);
//     } catch (error) {
//         console.error('Schedule creation error:', error);
//         res.status(500).json({
//             error: error.message || 'Failed to create schedule'
//         });
//     }
// };

// // // Update existing schedule (PATCH)
// // export const updateSchedule = async (req, res) => {
// //     try {
// //         const { scheduleId } = req.params;
// //         const updates = req.body;

// //         if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
// //             return res.status(400).json({ error: 'Invalid schedule ID' });
// //         }

// //         // Prevent changing doctorId
// //         if (updates.doctorId) {
// //             return res.status(400).json({ error: 'Cannot change doctor ID for existing schedule' });
// //         }

// //         // Find and update schedule
// //         const schedule = await DoctorSchedule.findByIdAndUpdate(
// //             scheduleId,
// //             { ...updates, updatedAt: Date.now() },
// //             { new: true, runValidators: true }
// //         );

// //         if (!schedule) {
// //             return res.status(404).json({ error: 'Schedule not found' });
// //         }

// //         res.status(200).json(schedule);
// //     } catch (error) {
// //         console.error('Schedule update error:', error);
// //         res.status(500).json({
// //             error: error.message || 'Failed to update schedule'
// //         });
// //     }
// // };

// // // Bulk update schedules (PUT)
// // export const bulkUpdateSchedules = async (req, res) => {
// //     try {
// //         const { doctorId, schedules } = req.body;

// //         if (!doctorId || !schedules || !Array.isArray(schedules)) {
// //             return res.status(400).json({ error: 'Doctor ID and schedules array are required' });
// //         }

// //         // Validate doctor exists
// //         const doctor = await mongoose.model('Doctor').findById(doctorId);
// //         if (!doctor) {
// //             return res.status(404).json({ error: 'Doctor not found' });
// //         }

// //         // Process each schedule
// //         const results = await Promise.all(schedules.map(async (scheduleData) => {
// //             if (scheduleData._id) {
// //                 // Update existing schedule
// //                 const existingSchedule = await DoctorSchedule.findById(scheduleData._id);
// //                 if (!existingSchedule) {
// //                     throw new Error(`Schedule not found: ${scheduleData._id}`);
// //                 }
// //                 if (existingSchedule.doctorId.toString() !== doctorId) {
// //                     throw new Error('Cannot change doctor ID for existing schedule');
// //                 }
// //                 Object.assign(existingSchedule, scheduleData);
// //                 return await existingSchedule.save();
// //             } else {
// //                 // Create new schedule
// //                 const newSchedule = new DoctorSchedule({
// //                     doctorId,
// //                     ...scheduleData
// //                 });
// //                 return await newSchedule.save();
// //             }
// //         }));

// //         res.status(200).json(results);
// //     } catch (error) {
// //         console.error('Bulk update error:', error);
// //         res.status(500).json({
// //             error: error.message || 'Failed to bulk update schedules'
// //         });
// //     }
// // };

// // // Get doctor's schedule
// // export const getDoctorSchedule = async (req, res) => {
// //     try {
// //         const { doctorId, date } = req.query;

// //         if (!doctorId) {
// //             return res.status(400).json({ error: 'Doctor ID is required' });
// //         }

// //         // Find all schedules for this doctor
// //         let query = { doctorId, isAvailable: true };

// //         if (date) {
// //             const targetDate = new Date(date);
// //             const dayOfWeek = getDay(targetDate); // 0 (Sunday) to 6 (Saturday)

// //             query.dayOfWeek = dayOfWeek;
// //             query.$or = [
// //                 { validTo: { $exists: false } },
// //                 { validTo: { $gte: targetDate } }
// //             ];
// //             query.validFrom = { $lte: targetDate };
// //         }

// //         const schedules = await DoctorSchedule.find(query)
// //             .sort({ dayOfWeek: 1, startTime: 1 });

// //         res.status(200).json(schedules);
// //     } catch (error) {
// //         console.error('Get schedule error:', error);
// //         res.status(500).json({ error: 'Failed to get schedule' });
// //     }
// // };

// // // Get available time slots for a doctor on a specific date
// // export const getAvailableSlots = async (req, res) => {
// //     try {
// //         const { doctorId, date } = req.query;

// //         if (!doctorId || !date) {
// //             return res.status(400).json({ error: 'Doctor ID and date are required' });
// //         }

// //         const targetDate = new Date(date);
// //         const dayOfWeek = getDay(targetDate);

// //         // Find doctor's schedule for this day of week
// //         const schedule = await DoctorSchedule.findOne({
// //             doctorId,
// //             dayOfWeek,
// //             isAvailable: true,
// //             validFrom: { $lte: targetDate },
// //             $or: [
// //                 { validTo: { $exists: false } },
// //                 { validTo: { $gte: targetDate } }
// //             ]
// //         });

// //         if (!schedule) {
// //             return res.status(200).json({ availableSlots: [] });
// //         }

// //         // Get existing appointments for this doctor on this date
// //         const appointments = await Appointment.find({
// //             doctorId,
// //             date: targetDate,
// //             status: { $in: ['scheduled', 'confirmed'] }
// //         });

// //         // Generate all possible slots
// //         const allSlots = generateTimeSlots(
// //             schedule.startTime,
// //             schedule.endTime,
// //             schedule.appointmentDuration,
// //             schedule.breakTimes
// //         );

// //         // Filter out booked slots
// //         const availableSlots = allSlots.filter(slot => {
// //             return !appointments.some(appt => {
// //                 const apptStart = appt.timeSlot.start;
// //                 const apptEnd = appt.timeSlot.end;
// //                 return (slot.start >= apptStart && slot.start < apptEnd) ||
// //                     (slot.end > apptStart && slot.end <= apptEnd) ||
// //                     (slot.start <= apptStart && slot.end >= apptEnd);
// //             });
// //         });

// //         res.status(200).json({
// //             doctorId,
// //             date: targetDate,
// //             availableSlots,
// //             appointmentDuration: schedule.appointmentDuration
// //         });
// //     } catch (error) {
// //         console.error('Get available slots error:', error);
// //         res.status(500).json({ error: 'Failed to get available slots' });
// //     }
// // };

// // // Helper function to generate time slots
// // function generateTimeSlots(startTime, endTime, duration, breaks = []) {
// //     const slots = [];
// //     const start = parse(startTime, 'HH:mm', new Date());
// //     const end = parse(endTime, 'HH:mm', new Date());

// //     let current = start;

// //     while (isBefore(addMinutes(current, duration), end)) {
// //         const slotEnd = addMinutes(current, duration);

// //         // Check if slot overlaps with any break
// //         const isDuringBreak = breaks.some(breakTime => {
// //             const breakStart = parse(breakTime.start, 'HH:mm', new Date());
// //             const breakEnd = parse(breakTime.end, 'HH:mm', new Date());

// //             return (current >= breakStart && current < breakEnd) ||
// //                 (slotEnd > breakStart && slotEnd <= breakEnd) ||
// //                 (current <= breakStart && slotEnd >= breakEnd);
// //         });

// //         if (!isDuringBreak) {
// //             slots.push({
// //                 start: format(current, 'HH:mm'),
// //                 end: format(slotEnd, 'HH:mm')
// //             });
// //         }

// //         current = slotEnd;
// //     }

// //     return slots;
// // }

// // // Book appointment with schedule validation
// // // export const bookAppointment = async (req, res) => {
// // //     try {
// // //         const { doctorId, date, timeSlot, patientId, reason } = req.body;

// // //         if (!doctorId || !date || !timeSlot || !patientId || !reason) {
// // //             return res.status(400).json({ error: 'Missing required fields' });
// // //         }

// // //         const appointmentDate = new Date(date);
// // //         const dayOfWeek = getDay(appointmentDate);

// // //         // 1. Check doctor's schedule
// // //         const schedule = await DoctorSchedule.findOne({
// // //             doctorId,
// // //             dayOfWeek,
// // //             isAvailable: true,
// // //             validFrom: { $lte: appointmentDate },
// // //             $or: [
// // //                 { validTo: { $exists: false } },
// // //                 { validTo: { $gte: appointmentDate } }
// // //             ]
// // //         });

// // //         if (!schedule) {
// // //             return res.status(400).json({ error: 'Doctor is not available on this date' });
// // //         }

// // //         // 2. Validate time slot fits within schedule
// // //         const slotStart = parse(timeSlot.start, 'HH:mm', new Date());
// // //         const slotEnd = parse(timeSlot.end, 'HH:mm', new Date());
// // //         const scheduleStart = parse(schedule.startTime, 'HH:mm', new Date());
// // //         const scheduleEnd = parse(schedule.endTime, 'HH:mm', new Date());

// // //         if (isBefore(slotStart, scheduleStart) || isAfter(slotEnd, scheduleEnd)) {
// // //             return res.status(400).json({
// // //                 error: 'Selected time slot is outside doctor\'s working hours'
// // //             });
// // //         }

// // //         // 3. Check for break times
// // //         const isDuringBreak = schedule.breakTimes.some(breakTime => {
// // //             const breakStart = parse(breakTime.start, 'HH:mm', new Date());
// // //             const breakEnd = parse(breakTime.end, 'HH:mm', new Date());

// // //             return (slotStart >= breakStart && slotStart < breakEnd) ||
// // //                 (slotEnd > breakStart && slotEnd <= breakEnd) ||
// // //                 (slotStart <= breakStart && slotEnd >= breakEnd);
// // //         });

// // //         if (isDuringBreak) {
// // //             return res.status(400).json({
// // //                 error: 'Selected time slot conflicts with doctor\'s break time'
// // //             });
// // //         }

// // //         // 4. Check slot duration matches doctor's setting
// // //         const slotDuration = (slotEnd - slotStart) / (1000 * 60);
// // //         if (slotDuration !== schedule.appointmentDuration) {
// // //             return res.status(400).json({
// // //                 error: `Appointment duration must be exactly ${schedule.appointmentDuration} minutes`
// // //             });
// // //         }

// // //         // 5. Check for existing appointments
// // //         const existingAppointment = await Appointment.findOne({
// // //             doctorId,
// // //             date: appointmentDate,
// // //             'timeSlot.start': timeSlot.start,
// // //             'timeSlot.end': timeSlot.end,
// // //             status: { $in: ['scheduled', 'confirmed'] }
// // //         });

// // //         if (existingAppointment) {
// // //             return res.status(409).json({
// // //                 error: 'This time slot is already booked'
// // //             });
// // //         }

// // //         // 6. Check max patients per schedule
// // //         const appointmentsCount = await Appointment.countDocuments({
// // //             doctorId,
// // //             date: appointmentDate,
// // //             status: { $in: ['scheduled', 'confirmed'] }
// // //         });

// // //         if (appointmentsCount >= schedule.maxPatients) {
// // //             return res.status(400).json({
// // //                 error: 'Doctor has reached maximum patients for this day'
// // //             });
// // //         }

// // //         // 7. Create the appointment
// // //         const appointment = new Appointment({
// // //             doctorId,
// // //             patientId,
// // //             date: appointmentDate,
// // //             timeSlot,
// // //             reason,
// // //             status: 'scheduled',
// // //             amount: doctor.consultationFee || 0
// // //         });

// // //         await appointment.save();

// // //         res.status(201).json(appointment);
// // //     } catch (error) {
// // //         console.error('Booking error:', error);
// // //         res.status(500).json({
// // //             error: error.message || 'Failed to book appointment'
// // //         });
// // //     }
// // // };

// // // Update doctor schedule availability
// // export const updateScheduleAvailability = async (req, res) => {
// //     try {
// //         const { scheduleId, isAvailable } = req.body;

// //         if (typeof isAvailable !== 'boolean') {
// //             return res.status(400).json({ error: 'isAvailable must be a boolean' });
// //         }

// //         const schedule = await DoctorSchedule.findByIdAndUpdate(
// //             scheduleId,
// //             { isAvailable, updatedAt: Date.now() },
// //             { new: true }
// //         );

// //         if (!schedule) {
// //             return res.status(404).json({ error: 'Schedule not found' });
// //         }

// //         res.status(200).json(schedule);
// //     } catch (error) {
// //         console.error('Update availability error:', error);
// //         res.status(500).json({ error: 'Failed to update schedule availability' });
// //     }
// // };