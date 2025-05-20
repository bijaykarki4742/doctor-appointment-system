import jwt from 'jsonwebtoken';
import  User  from '../models/Entity/usermodel.js';
import { Patient } from '../models/Entity/patient.model.js';
import { Doctor } from '../models/Entity/doctor.model.js';

export const signup = async (req, res) => {
    try {
        const { email, password, role, ...profileData } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const user = await User.create({ email, password, role });

        try {
            //Create role-specific profile
            if (role === "doctor") {
                // Process doctor-specific data
                const doctorData = {
                    user: user._id,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    contact: profileData.contact || "0000000000",
                    specialization: profileData.specialization || "None",
                    licenseNumber: profileData.licenseNumber || "0000",
                    experience: Number(profileData.experience) || 0,
                    gender: profileData.gender || 'Male',
                    age: profileData.age || 0,
                    // Array fields - ensure they're properly formatted
                    qualifications: Array.isArray(profileData.qualifications)
                        ? profileData.qualifications
                        : [profileData.qualifications].filter(Boolean),
                    hospitalAffiliation: Array.isArray(profileData.hospitalAffiliation)
                        ? profileData.hospitalAffiliation
                        : [profileData.hospitalAffiliation].filter(Boolean),
                    // Optional fields
                    consultationFee: Number(profileData.consultationFee) || 0,
                    bio: profileData.bio || "",
                    languagesSpoken: Array.isArray(profileData.languagesSpoken)
                        ? profileData.languagesSpoken
                        : [profileData.languagesSpoken].filter(Boolean),
                    profilePicture: profileData.profilePicture || "",
                    isVerified: Boolean(profileData.isVerified)
                };

                await Doctor.create(doctorData);
            } else {
                const patientData = {
                    user: user._id,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    contact: profileData.contact,
                    dateOfBirth: new Date(profileData.dateOfBirth),
                    gender: profileData.gender,
                    // Handle nested objects
                    address: profileData.address || {},
                    insuranceInfo: profileData.insuranceInfo || {},
                    // Array fields
                    medicalHistory: Array.isArray(profileData.medicalHistory)
                        ? profileData.medicalHistory
                        : [],
                    allergies: Array.isArray(profileData.allergies)
                        ? profileData.allergies
                        : [profileData.allergies].filter(Boolean),
                    emergencyContact: profileData.emergencyContact || {},
                    profilePicture: profileData.profilePicture || ""
                };
                await Patient.create(patientData);
            }
        } catch (error) {
            // If profile creation fails, delete the user we just created
            await User.deleteOne({ _id: user._id });

            // Re-throw the profile error to be caught by the outer catch
            throw profileError;
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            user: { email: user.email, role: user.role, id: user._id }
        });

    } catch (error) {
        console.error("SIGNUP ERROR:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }

        if (error.name === "MongooseError") {
            return res.status(400).json({ error: error.message })
        }
        res.status(500).json({
            error: "Server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        //find user
        const user = await User.findOne({ email }).select('+password');

        //Verify if user doesn't exist or password doesn't matche
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid credentials');
        }

        //Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ success: true, token, user: { email: user.email, role: user.role, } });
    } catch (error) {
        // console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
};