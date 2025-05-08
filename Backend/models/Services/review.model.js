import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
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
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Appointment ID is required'],
        unique: true,
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be a whole number'
        }
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters'],
        validate: {
            validator: function (v) {
                // Basic profanity filter (extend this list as needed)
                const profanity = /\b(asshole|fuck|shit|bitch)\b/i;
                return !profanity.test(v);
            },
            message: 'Comment contains inappropriate language'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Middleware to update timestamps
ReviewSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});

// Prevent duplicate reviews for same appointment
ReviewSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existingReview = await mongoose.model('Review').findOne({
            appointmentId: this.appointmentId
        });
        if (existingReview) {
            throw new Error('A review already exists for this appointment');
        }
    }
    next();
});

const Review = mongoose.model('Review', ReviewSchema);

export { Review };