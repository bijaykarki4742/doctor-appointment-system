// routes/uploadsRoutes.js
import { Router } from 'express';
import { upload, uploadProfilePicture } from '../controllers/uploadsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const uploadsRouter = Router();

uploadsRouter.post(
    '/profile-picture',
    authenticate,
    upload.single('profilePicture'),
    uploadProfilePicture
);

export default uploadsRouter;