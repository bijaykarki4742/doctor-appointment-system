import { Router } from "express";
import authrouter from "./authRoutes.js";

const router = Router();

// Home route
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Easy Care API!",
        endpoints: {
            auth: "/v1/api/auth",
            patients: "/patients",
            doctors: "/doctors",
            admin: "/admin"
        }
    });
});

router.use('/v1/api/auth',authrouter);


export default router;