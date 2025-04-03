import { Doctor } from "../../models/doctor.model.js";

// Get all Doctors
export async function getDoctors(req, res) {
    try {
        const allDoctors = await Doctor.find();
        res.status(200).json({ message: "All Doctor Details", allDoctors });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a Doctor by ID
export async function getDoctorById(req, res) {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ message: "Specific Doctor Details", doctor });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a Doctor
export async function updateDoctor(req, res) {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ message: "Doctor updated successfully", doctor });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get current doctor profile (based on authenticated user)
export async function getCurrentDoctor(req, res) {
    try {
        // Assuming your auth middleware attaches user to req.user
        const doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        res.status(200).json({
            message: "Current doctor profile",
            doctor
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a Doctor
export async function deleteDoctor(req, res) {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}