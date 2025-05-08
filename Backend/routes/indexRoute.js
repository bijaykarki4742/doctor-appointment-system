import { Router } from "express";
import authrouter from "./authRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import userRoutes from "./userRoutes.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { getCurrentUserProfile } from "../controllers/userController.js";
import appointmentRouter from "./appointmentRoutes.js";
import paymentRouter from "./paymentRoutes.js";

const router = Router();

// Home route
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Easy Care API!",
        endpoints: {
            auth: "/v1/api/auth",
            patients: "/v1/api/users",
            doctors: "/v1/api/doctors",
            admin: "/admin",
            appointments: "/v1/api/appointments",
            payments: "/v1/api/payments"
        }
    });
});

router.get("/v1/api/users/me",authenticate, getCurrentUserProfile);
router.use('/v1/api/auth',authrouter);
router.use('/v1/api/doctors',doctorRoutes);
router.use('/v1/api/users',userRoutes);
router.use('/v1/api/appointments',appointmentRouter);
router.use('/v1/api/payments',paymentRouter);


export default router;