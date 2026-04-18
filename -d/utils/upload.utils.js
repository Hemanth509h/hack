import multer from "multer";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary synchronously via env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use MemoryStorage so the file is never written to local disk (avoids Docker volume bloat)
const storage = multer.memoryStorage();

// Restrict uploads to only image formats
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only image files are allowed."));
  }
};

// Expose the Multer middleware with a strict maximum boundary (e.g. 5MB)
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

/**
 * Resizes an image via Sharp natively and uploads directly to Cloudinary resolving the secure_url
 * @param buffer Raw image buffer from Multer
 * @param folder Cloudinary folder to dump output into (e.g. 'avatars')
 */
export const processAndUploadImage = async (
  buffer,
  folder = "the_quad_media",
) => {
  // We force everything to a optimized .webp to strictly conserve frontend bandwidth mapping
  const webpBuffer = await sharp(buffer)
    .resize(400, 400, { fit: "cover", position: "center" }) // Force square crop for avatars typically
    .webp({ quality: 80 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    // We utilize upload_stream because the buffer is in-memory
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", format: "webp" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Unknown Cloudinary upload error"));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    // Write buffer down into the cloud pipe
    uploadStream.end(webpBuffer);
  });
};
