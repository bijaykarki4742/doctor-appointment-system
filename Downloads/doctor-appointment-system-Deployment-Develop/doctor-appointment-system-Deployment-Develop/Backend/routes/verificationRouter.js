// routes/verificationRoutes.js
import { Router } from 'express';
import upload from '../middleware/upload.js';
import { getAllVerifications, getVerificationImage, submitVerification } from '../controllers/doctor/doctorVerificationController.js';

const verificationRouter = Router();

verificationRouter.post('/:doctorId/submit', upload, submitVerification);
verificationRouter.get('/submissions', getAllVerifications);
verificationRouter.get('/verification-images', getVerificationImage);

export default verificationRouter;