import { Appointment } from '../models/Services/appointment.model.js';
import mongoose from "mongoose";

export const getAppointmentStats = async (req, res) => {
    try {
        // Destructure doctorId from request body
        const { doctorId } = req.body;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required in request body'
            });
        }

        // Validate and convert to ObjectId
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Doctor ID format'
            });
        }

        const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

        // Get current date in UTC
        const now = new Date();
        const todayStart = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            0, 0, 0, 0
        ));
        const todayEnd = new Date(todayStart);
        todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

        console.log('Querying between:', todayStart.toISOString(), 'and', todayEnd.toISOString());

        const todayAppointments = await Appointment.find({
            doctorId: doctorObjectId,
            date: {
                $gte: todayStart,
                $lt: todayEnd
            }
        });

        console.log('Found appointments:', todayAppointments);

        // Today's stats
        const todayStats = {
            total: todayAppointments.length,
            scheduled: todayAppointments.filter(a => a.status === 'scheduled').length,
            completed: todayAppointments.filter(a => a.status === 'completed').length,
            cancelled: todayAppointments.filter(a => a.status === 'cancelled').length,
            inProgress: todayAppointments.filter(a => a.status === 'in-progress').length
        };
        console.log(todayStats);
        console.log(todayStats.total);

        // Weekly stats (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyAppointments = await Appointment.aggregate([
            {
                $match: {
                    doctorId: doctorObjectId,
                    date: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" },
                    total: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    },
                    scheduled: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "scheduled"] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Format weekly data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyStats = Array(7).fill().map((_, i) => {
            const dayData = weeklyAppointments.find(a => a._id === i + 1) || {
                total: 0,
                completed: 0,
                scheduled: 0
            };
            return {
                day: days[i],
                total: dayData.total,
                completed: dayData.completed,
                scheduled: dayData.scheduled
            };
        });

        res.json({
            success: true,
            todayStats,
            weeklyStats
        });

    } catch (error) {
        console.error('Error fetching appointment stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching appointment statistics',
            error: error.message
        });
    }
};
