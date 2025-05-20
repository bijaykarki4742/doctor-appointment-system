import mongoose from "mongoose";
import { Patient } from "../../models/Entity/patient.model.js";

// Get all Doctors
export async function getAllPatients(req, res) {
    try {
        const allPatients  = await Patient.find();
        res.status(200).json({ message: "All Patient Details", allPatients});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a Doctor by ID
export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid patient ID' });
        }

        const patient = await Patient.findById(id).populate('user', '-password');
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a patient
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid patient ID' });
        }

        const patient = await Patient.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('user', '-password');
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get current doctor profile (based on authenticated user)
export async function getCurrentDoctor(req, res) {
    try {
        // Assuming your auth middleware attaches user to req.user
        const patient = await Patient.findOne({ user: req.user._id });

        if (!patient) {
            return res.status(404).json({ message: "patient profile not found" });
        }

        res.status(200).json({
            message: "Current patient profile",
            patient
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a Doctor
export async function deletePatient(req, res) {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ message: "patient not found" });
        res.status(200).json({ message: "patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}