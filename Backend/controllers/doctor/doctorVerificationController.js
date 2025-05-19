import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Doctor } from "../../models/Entity/doctor.model.js";
import verificationModel from "../../models/Services/verification.model.js";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure upload directory
const UPLOAD_DIR = join(__dirname, '../../uploads/verifications'); // Adjusted path to go two levels up
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function submitVerification(req, res) {
  try {
    // console.log('Received file:', req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { doctorId } = req.params;

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      // Clean up the uploaded file if doctor doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Doctor not found' });
    }

    //real path to the image url
    const relativePath = `verifications/${req.file.filename}`;

    // Create verification record
    const verification = new verificationModel({
      doctorId,
      imagePath: relativePath,
      status: 'pending'
    });

    await verification.save();

    // Update doctor's verification status
    doctor.verificationStatus = 'pending';
    await doctor.save();

    res.status(201).json({
      message: 'Verification submitted successfully',
      verification: {
        id: verification._id,
        doctorId: verification.doctorId,
        status: verification.status,
        imageUrl: `/verification-images/${req.file.filename}` // Assuming you'll serve files statically
      }
    });

  } catch (error) {
    // Clean up file if error occurs
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Server error during verification',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
export async function setVerificationStatus(req, res) {
  try {
    const { doctorId } = req.params;
    const { status } = req.body;

    console.log('Setting verification status:', { doctorId, status });

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Find the verification record
    const verification = await verificationModel.findOne({ doctorId }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(404).json({ error: 'Verification record not found' });
    }

    // Update the verification status
    verification.status = status;
    await verification.save();

    // Update doctor's verification status
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
      doctor.verificationStatus = status;
      await doctor.save();
    }

    res.json({
      message: 'Verification status updated successfully',
      verification: {
        id: verification._id,
        doctorId: verification.doctorId,
        status: verification.status,
        imageUrl: `/verification-images/${verification.imagePath.split(/[\\/]/).pop()}` // Handles both / and \ in paths
      }
    });
  }
  catch (error) {
    console.error('Error setting verification status:', error);
    res.status(500).json({ error: 'Error setting verification status' });
  }
}

export async function getAllVerifications(req, res) {
  try {
    const verifications = await verificationModel.find()
      .populate('doctorId', 'name email') // Add more fields if needed
      .sort({ createdAt: -1 });

    res.json({
      total: verifications.length,
      verifications: verifications.map(v => ({
        id: v._id,
        doctor: {
          _id: v.doctorId._id,
          name: v.doctorId.name,
          email: v.doctorId.email
        },
        status: v.status,
        createdAt: v.createdAt,
        imageUrl: `/verification-images/${v.imagePath.split(/[\\/]/).pop()}` // Handles both / and \ in paths
      }))
    });

  } catch (error) {
    console.error('Error fetching verifications:', error);
    res.status(500).json({ error: 'Error retrieving verification data' });
  }
}

export async function getVerificationImage(req, res) {
  const { filename } = req.params;
  console.log('Requested filename:', filename);
  const imagePath = join(__dirname, '../../uploads/verifications', filename);

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Set content type header (basic image type detection)
  const ext = path.extname(filename).toLowerCase();
  const mimeType = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', mimeType);
  fs.createReadStream(imagePath).pipe(res);
}

// export async function getOneVerificationImage(req, res) {
//   try {
//     const verifications = await verificationModel.find()
//       .populate('doctorId', 'name email') // Add more fields if needed
//       .sort({ createdAt: -1 });

//     res.json({
//       total: verifications.length,
//       verifications: verifications.map(v => ({
//         id: v._id,
//         doctor: {
//           _id: v.doctorId._id,
//           name: v.doctorId.name,
//           email: v.doctorId.email
//         },
//         status: v.status,
//         createdAt: v.createdAt,
//         imageUrl: `/verification-images/${v.imagePath.split(/[\\/]/).pop()}` // Handles both / and \ in paths
//       }))
//     });

//   } catch (error) {
//     console.error('Error fetching verifications:', error);
//     res.status(500).json({ error: 'Error retrieving verification data' });
//   }
// }


// export async function getVerificationStatus(req, res) {
//   try {
//     const { doctorId } = req.params;
//     const verification = await verificationModel.findOne({ doctorId })
//       .sort({ createdAt: -1 });

//     if (!verification) {
//       return res.status(404).json({ error: 'No verification record found' });
//     }

//     res.json({
//       status: verification.status,
//       lastUpdated: verification.updatedAt,
//       imageUrl: verification.imagePath // Or generate URL if using static serving
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching verification status' });
//   }
// }