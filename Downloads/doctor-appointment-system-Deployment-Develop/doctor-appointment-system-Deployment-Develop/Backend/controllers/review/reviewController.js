import mongoose from 'mongoose';
import { Appointment } from '../../models/Services/appointment.model.js';
import { Review } from '../../models/Services/review.model.js';

export const createReview = async (req, res) => {
    try {
        const { appointmentId, rating, comment } = req.body;

        const userId = req.user._id;

        // Find patient by userId
        const patient = await mongoose.model('Patient').findOne({ user: userId });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });

        const patientId = patient._id;
        // Verify the appointment exists and belongs to this patient
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (!appointment.patientId.equals(patientId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to review this appointment' });
        }

        // if (appointment.status !== 'completed') {
        //     return res.status(400).json({ success: false, message: 'Can only review completed appointments' });
        // }

        const newReview = new Review({
            patientId,
            doctorId: appointment.doctorId,
            appointmentId,
            rating,
            comment
        });

        await newReview.save();

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: newReview
        });
    } catch (error) {
        if (error.message.includes('duplicate key error')) {
            return res.status(400).json({ success: false, message: 'A review already exists for this appointment' });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message
        });
    }
}

// const getReviewById = async (req, res) => {
//     try {
//         const { reviewId } = req.params;

//         const review = await Review.findById(reviewId)
//             .populate('patientId', 'firstName lastName avatar')
//             .populate('doctorId', 'firstName lastName specialization');

//         if (!review) {
//             return res.status(404).json({ success: false, message: 'Review not found' });
//         }

//         res.status(200).json({
//             success: true,
//             data: review
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch review',
//             error: error.message
//         });
//     }
// }

// const updateReview = async (req, res) => {
//     try {
//         const { reviewId } = req.params;
//         const { rating, comment } = req.body;
//         const patientId = req.user.userId; // From authentication middleware

//         const review = await Review.findById(reviewId);

//         if (!review) {
//             return res.status(404).json({ success: false, message: 'Review not found' });
//         }

//         if (!review.patientId.equals(patientId)) {
//             return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
//         }

//         // Only update fields that are provided
//         if (rating !== undefined) review.rating = rating;
//         if (comment !== undefined) review.comment = comment;

//         await review.save();

//         res.status(200).json({
//             success: true,
//             message: 'Review updated successfully',
//             data: review
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update review',
//             error: error.message
//         });
//     }
// }

// const deleteReview = async (req, res) => {
//     try {
//         const { reviewId } = req.params;
//         const { userId, role } = req.user; // From authentication middleware

//         const review = await Review.findById(reviewId);

//         if (!review) {
//             return res.status(404).json({ success: false, message: 'Review not found' });
//         }

//         // Only allow patient who created it or admin to delete
//         if (!review.patientId.equals(userId) && role !== 'admin') {
//             return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
//         }

//         await review.remove();

//         res.status(200).json({
//             success: true,
//             message: 'Review deleted successfully'
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to delete review',
//             error: error.message
//         });
//     }
// }

// const getPatientReviews = async (req, res) => {
//     try {
//         const { patientId } = req.params;
//         const { page = 1, limit = 10 } = req.query;

//         if (!mongoose.Types.ObjectId.isValid(patientId)) {
//             return res.status(400).json({ success: false, message: 'Invalid patient ID' });
//         }

//         const reviews = await Review.find({ patientId })
//             .populate('doctorId', 'firstName lastName specialization')
//             .limit(limit * 1)
//             .skip((page - 1) * limit)
//             .exec();

//         const count = await Review.countDocuments({ patientId });

//         res.status(200).json({
//             success: true,
//             data: reviews,
//             meta: {
//                 total: count,
//                 totalPages: Math.ceil(count / limit),
//                 currentPage: page,
//                 itemsPerPage: reviews.length
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch patient reviews',
//             error: error.message
//         });
//     }
// }

// const getDoctorRatingStats = async (req, res) => {
//     try {
//         const { doctorId } = req.params;

//         const stats = await Review.aggregate([
//             { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
//             {
//                 $group: {
//                     _id: '$doctorId',
//                     averageRating: { $avg: '$rating' },
//                     totalReviews: { $sum: 1 },
//                     fiveStar: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
//                     fourStar: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
//                     threeStar: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
//                     twoStar: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
//                     oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
//                 }
//             }
//         ]);

//         const result = stats[0] || {
//             _id: doctorId,
//             averageRating: 0,
//             totalReviews: 0,
//             fiveStar: 0,
//             fourStar: 0,
//             threeStar: 0,
//             twoStar: 0,
//             oneStar: 0
//         };

//         res.status(200).json({
//             success: true,
//             data: {
//                 doctorId: result._id,
//                 averageRating: parseFloat(result.averageRating.toFixed(1)),
//                 totalReviews: result.totalReviews,
//                 ratingDistribution: {
//                     fiveStar: result.fiveStar,
//                     fourStar: result.fourStar,
//                     threeStar: result.threeStar,
//                     twoStar: result.twoStar,
//                     oneStar: result.oneStar
//                 }
//             }
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch rating stats',
//             error: error.message
//         });
//     }
// }
