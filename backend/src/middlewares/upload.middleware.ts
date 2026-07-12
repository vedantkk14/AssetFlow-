import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { Request, Response, NextFunction } from 'express';

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer Local Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WEBP image uploads are allowed'));
    }
  },
});

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured =
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

// Middleware to handle image upload
export const handleImageUpload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  // If Cloudinary is configured, upload local file, get URL, and delete local file
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'assetflow/assets',
      });
      // Delete temporary local file
      fs.unlinkSync(req.file.path);
      // Attach url to req
      req.body.imageUrl = result.secure_url;
      next();
    } catch (error) {
      // Clean up local file in case of upload error
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  } else {
    // If Cloudinary is not configured, resolve URL pointing to the static folder on server
    const port = env.PORT || 5000;
    req.body.imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    next();
  }
};

export const uploadSingleImage = upload.single('image');
