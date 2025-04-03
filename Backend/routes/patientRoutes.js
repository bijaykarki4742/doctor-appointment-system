import express from 'express';

const patientRoutes = express.Router();

// GET /patie
patientRoutes.get('/patient/', (req, res) => {
    res.status(200).json({
        message: "Patient route",
    });
});

export default patientRoutes;