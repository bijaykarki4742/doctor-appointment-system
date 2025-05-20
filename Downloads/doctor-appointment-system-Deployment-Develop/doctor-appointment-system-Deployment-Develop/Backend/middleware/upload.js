// upload.js - ES module format
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const file_name = fileURLToPath(import.meta.url);
const dirName = dirname(file_name);

const UPLOAD_DIR = join(dirName, '../uploads/verifications');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `verification-${uniqueSuffix}${extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extValid = allowedTypes.test(extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG/JPG/PNG images allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
}).single('verificationImage');

export default upload;