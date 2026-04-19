import multer from 'multer';
// Use memory storage for direct processing via Sharp locally before sending to S3/Cloudinary
const storage = multer.memoryStorage();
export const uploadSettings = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB default global hard cap internally, routes can tighten it
    },
    fileFilter: (_req, file, cb) => {
        // Basic array checking
        if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid generic filetype. Allowed formats: JPEG, PNG, WEBP, GIF.'));
        }
    },
});
