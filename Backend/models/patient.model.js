import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const PatientSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
    firstName: {
        type: String,
        required: [true,"First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true,"Last name is required"],
        trim: true
    },
    contact: {
        type: String,
        required: [true,"Contact number is required"],
        validate: {
            validator: function (v) {
                return /\d{10,15}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true,"Date of Birth is required"]
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true,"Gender is required"]
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    insuranceInfo: {
        provider: String,
        policyNumber: String
    },
    medicalHistory: [{
        condition: String,
        diagnosisDate: Date,
        treatment: String
    }],
    allergies: [String],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    profilePicture: String,
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
PatientSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Patient = mongoose.model('Patient', PatientSchema);

export { Patient };