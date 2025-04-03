import { Router } from "express";
import authrouter from "./authRoutes.js";
import doctorRoutes from "./doctorRoutes.js";

const router = Router();

// Home route
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Easy Care API!",
        endpoints: {
            auth: "/v1/api/auth",
            patients: "/patients",
            doctors: "/v1/api/doctors",
            admin: "/admin"
        }
    });
});

router.use('/v1/api/auth',authrouter);
router.use('/v1/api/doctors',doctorRoutes);


export default router;