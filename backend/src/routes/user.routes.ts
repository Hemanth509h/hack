import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateProfileSchema, updateInterestsSchema, addSkillSchema } from '../validations/user.validation';
import { uploadMiddleware } from '../utils/upload.utils';
import {
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  updateInterests,
  getUserEvents,
  getUserClubs,
  uploadAvatar,
  getPortfolio
} from '../controllers/user.controller';

const router = Router();

// ---- Public Discovery ----
router.get('/:id/profile', requireAuth, getProfile);
router.get('/:id/portfolio', getPortfolio); // Portfolio is always public

// ---- Profile Mutations (Owner only enforced in controller) ----
router.put('/:id/profile', requireAuth, validateRequest(updateProfileSchema), updateProfile);
router.put('/:id/interests', requireAuth, validateRequest(updateInterestsSchema), updateInterests);

// ---- Skills management ----
router.post('/:id/skills', requireAuth, validateRequest(addSkillSchema), addSkill);
router.delete('/:id/skills/:skillId', requireAuth, removeSkill);

// ---- Activity Data ----
router.get('/:id/events', requireAuth, getUserEvents);
router.get('/:id/clubs', getUserClubs); // Memberships are public

// ---- Avatar Upload (multer single file) ----
router.post('/:id/avatar', requireAuth, uploadMiddleware.single('avatar'), uploadAvatar);

export default router;
