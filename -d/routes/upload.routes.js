import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadSettings } from "../middleware/upload.middleware";
import {
  uploadSingleImage,
  deleteImage,
} from "../controllers/upload.controller";

const router = Router();

// Expecting a multipart-form payload with field-name 'image'
router.post(
  "/image",
  requireAuth,
  uploadSettings.single("image"),
  uploadSingleImage,
);

router.delete("/:publicId(*)", requireAuth, deleteImage);

export default router;
