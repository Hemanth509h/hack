"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSettings = void 0;
const multer_1 = __importDefault(require("multer"));
// Use memory storage for direct processing via Sharp locally before sending to S3/Cloudinary
const storage = multer_1.default.memoryStorage();
exports.uploadSettings = (0, multer_1.default)({
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
