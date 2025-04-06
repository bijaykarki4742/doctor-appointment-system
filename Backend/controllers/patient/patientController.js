import { Patient } from "../../models/patient.model.js";

// Get all Patients

export async function createPatient(req, res) {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json({ message: "Patient created successfully", patient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export async function getPatients(req, res) {
    try {
        const allPatients = await Patient.find();
        res.status(200).json({ message: "All Patient Details", allPatients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a Patient by ID
export async function getPatientById(req, res) {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.status(200).json({ message: "Specific Patient Details", patient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a Patient
export async function updatePatient(req, res) {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.status(200).json({ message: "Patient updated successfully", patient });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get current patient profile (based on authenticated user)
export async function getCurrentPatient(req, res) {
    try {
        // Assuming your auth middleware attaches user to req.user
        const patient = await Patient.findOne({ user: req.user._id });

        if (!patient) {
            return res.status(404).json({ message: "Patient profile not found" });
        }

        res.status(200).json({
            message: "Current patient profile",
            patient
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a Patient
export async function deletePatient(req, res) {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}