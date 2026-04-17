"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_validation_1 = require("../validations/user.validation");
const upload_utils_1 = require("../utils/upload.utils");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// ---- Public Discovery ----
router.get('/:id/profile', auth_middleware_1.requireAuth, user_controller_1.getProfile);
router.get('/:id/portfolio', user_controller_1.getPortfolio); // Portfolio is always public
// ---- Profile Mutations (Owner only enforced in controller) ----
router.put('/:id/profile', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(user_validation_1.updateProfileSchema), user_controller_1.updateProfile);
router.put('/:id/interests', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(user_validation_1.updateInterestsSchema), user_controller_1.updateInterests);
router.post('/:id/location', auth_middleware_1.requireAuth, user_controller_1.updateLocation);
// ---- Skills management ----
router.post('/:id/skills', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(user_validation_1.addSkillSchema), user_controller_1.addSkill);
router.delete('/:id/skills/:skillId', auth_middleware_1.requireAuth, user_controller_1.removeSkill);
// ---- Activity Data ----
router.get('/:id/events', auth_middleware_1.requireAuth, user_controller_1.getUserEvents);
router.get('/:id/clubs', user_controller_1.getUserClubs); // Memberships are public
// ---- Avatar Upload (multer single file) ----
router.post('/:id/avatar', auth_middleware_1.requireAuth, upload_utils_1.uploadMiddleware.single('avatar'), user_controller_1.uploadAvatar);
exports.default = router;
