import { Router } from "express";

import { sendAppointmentNotification } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const notificationRouter = Router();

notificationRouter.post('/',authenticate, sendAppointmentNotification);

export default notificationRouter;