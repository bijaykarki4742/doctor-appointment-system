import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        unique:[true,"Contact number should be unique"],
        validate: {
            validator: function (v) {
                return /\d{10,15}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        default:"0000000000"
    },
    specialization: {
        type: String,
        required: true,
        enum: ["None","Cardiology", "Dermatology", "Pediatrics", "Neurology", "Orthopedics", "Gastroenterology", "Ophthalmology", "Psychiatry",],
        default:"None"
    },
    qualifications: [{
        degree: String,
        university: String,
        year: Number
    }],
    licenseNumber: {
        type: String,
        required: true,
        unique: [true,"licenseNumber should be unique"],
        validate: {
            validator: v => /^\d{4,8}$/.test(v),
            message: "Invalid license number format"
        },
        default:"0000"
    },
    hospitalAffiliation: [{
        name: String,
        address: String,
        position: String
    }],
    experience: {
        type: Number,
        required: true,
        default:0
    },
    bio: String,
    languagesSpoken: [String],
    consultationFee: {
        type: Number,
        default:0
    },
    profilePicture: String,
    isVerified: {
        type: Boolean,
        default: false
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

// updating timestamp hook
DoctorSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export { Doctor };