import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from '../models/Entity/usermodel.js';
import { Patient } from '../models/Entity/patient.model.js';
import { Doctor } from '../models/Entity/doctor.model.js';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profile-pictures/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, req.user.id + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
    }
};

// Initialize upload
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Construct the file URL
        const fileUrl = `/profile-pictures/${req.file.filename}`;
        const userId = req.user._id; // Assuming you have user ID in req.user
        const userRole = req.user.role; // Assuming you have user role in req.user

        let updatedUser;

        if (userRole === 'patient') {
            const patient = await Patient.findOne({ user: userId });
            console.log('Patient:', patient);

            if (!patient) {
                fs.unlinkSync(req.file.path);
                return res.status(404).json({ message: 'Patient record not found' });
            }

            // Delete old profile picture if exists
            if (patient.profilePicture) {
                const oldFilename = patient.profilePicture.split('/').pop();
                const oldPath = path.join('uploads/profile-pictures/', oldFilename);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Update patient profile picture
            const updatedPatient = await Patient.findByIdAndUpdate(
                patient._id,
                {
                    profilePicture: fileUrl,
                    updatedAt: Date.now() // Trigger your schema's update timestamp
                },
                { new: true }

            );

            res.status(200).json({
                message: 'Profile picture updated successfully',
                profilePicture: updatedPatient.profilePicture,
                patient: {
                    firstName: updatedPatient.firstName,
                    lastName: updatedPatient.lastName,
                    // Include other relevant patient fields
                }
            });
        }

        res.status(200).json({
            message: 'Profile picture uploaded successfully',
            profilePicture: updatedUser.profilePicture
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);

        // Delete the uploaded file if error occurred
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
    }
};