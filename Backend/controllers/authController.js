import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/usermodel.js';
import { Patient } from '../models/patient.model.js';
import { Doctor } from '../models/doctor.model.js';

export const signup = async (req, res) => {
    try {
        const { email, password, role, ...profileData } = req.body;
        console.log("Incoming data:", req.body);

        const existingUser = await User.findOne({ email: req.body.email });
        console.log(' Existing user', existingUser);

        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        console.log("4. Creating user");
        const user = await User.create({ email, password, role });
        console.log("5. User created:", user._id);

        console.log("6. Creating profile");
        //Create role-specific profile
        if (role === "doctor") {
            await Doctor.create({
                //required
                user: user._id,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                contact: profileData.contact || "0000000000",
                specialization: profileData.specialization || "None",
                licenseNumber: profileData.licenseNumber || "0000",
                experience: profileData.experience || 0,

                //optional
                consultationFee: profileData.consultationFee || 0,
                qualifications: profileData.qualifications || [],
                hospitalAffiliation: profileData.hospitalAffiliation || [],
                bio: profileData.bio || "",
                languagesSpoken: profileData.languagesSpoken || [],
                profilePicture: profileData.profilePicture || "",
                isVerified: profileData.isVerified || false
            });
        } else {
            await Patient.create({
                user: user._id,
                // Required fields (no defaults)
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                contact: profileData.contact,
                dateOfBirth: profileData.dateOfBirth,
                gender: profileData.gender,
                
                // Optional fields (with defaults)
                address: profileData.address || {
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: ''
                },
                insuranceInfo: profileData.insuranceInfo || {
                    provider: '',
                    policyNumber: ''
                },
                medicalHistory: profileData.medicalHistory || [],
                allergies: profileData.allergies || [],
                emergencyContact: profileData.emergencyContact || {
                    name: '',
                    relationship: '',
                    phone: ''
                },
                profilePicture: profileData.profilePicture || ''
            });
        }
        console.log("Profile created ", user);

        // Generate JWT token
        console.log("8. Generating token");
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

        res.json({ success: true, token, user: { email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed. Please try again.' 
        });
    }
};