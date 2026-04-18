import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getPreferences,
  updatePreferences,
  registerDeviceToken,
  removeDeviceToken,
  testNotification,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

// All notification routes require authentication
router.use(requireAuth);

// ---- Listing & Status ----
router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

// ---- Preferences ----
router.get("/preferences", getPreferences);
router.post("/preferences", updatePreferences);

// ---- Device Token Management (FCM) ----
router.post("/device-token", registerDeviceToken);
router.delete("/device-token", removeDeviceToken);

// ---- Dev-only testing ----
router.post("/test", testNotification);

export default router;
