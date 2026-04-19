import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { updateProfileSchema, updateInterestsSchema, addSkillSchema } from '../validations/user.validation.js';
import { uploadMiddleware } from '../utils/upload.utils.js';
import { getProfile, updateProfile, addSkill, removeSkill, updateInterests, getUserEvents, getUserClubs, uploadAvatar, getPortfolio, updateLocation } from '../controllers/user.controller.js';
const router = Router();
// ---- Public Discovery ----
router.get('/:id/profile', requireAuth, getProfile);
router.get('/:id/portfolio', getPortfolio); // Portfolio is always public
// ---- Profile Mutations (Owner only enforced in controller) ----
router.put('/:id/profile', requireAuth, validateRequest(updateProfileSchema), updateProfile);
router.put('/:id/interests', requireAuth, validateRequest(updateInterestsSchema), updateInterests);
router.post('/:id/location', requireAuth, updateLocation);
// ---- Skills management ----
router.post('/:id/skills', requireAuth, validateRequest(addSkillSchema), addSkill);
router.delete('/:id/skills/:skillId', requireAuth, removeSkill);
// ---- Activity Data ----
router.get('/:id/events', requireAuth, getUserEvents);
router.get('/:id/clubs', getUserClubs); // Memberships are public
// ---- Avatar Upload (multer single file) ----
router.post('/:id/avatar', requireAuth, uploadMiddleware.single('avatar'), uploadAvatar);
export default router;
