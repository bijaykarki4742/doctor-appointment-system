import { Doctor } from "../models/Entity/doctor.model.js";
import { Patient } from "../models/Entity/patient.model.js";

// userController.js
export const getCurrentUserProfile = async (req, res) => {
    try {
      const user = req.user; // From auth middleware
  
      // Fetch linked profile based on role
      let profile = null;
      if (user.role === 'doctor') {
        profile = await Doctor.findOne({ user: user._id }).populate('user');
      } else if (user.role === 'patient') {
        profile = await Patient.findOne({ user: user._id }).populate('user');
      }
  
      console.log("User Profile:", profile);

      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          isSuperAdmin: user.isSuperAdmin
        },
        profile
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };