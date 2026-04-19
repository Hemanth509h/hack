import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validateRequest, validateQuery } from '../middleware/validate.middleware.js';
import { createSkillSchema, searchSkillSchema } from '../validations/skill.validation.js';
import { getAllSkills, searchSkills, getSkillCategories, createSkill } from '../controllers/skill.controller.js';
const router = Router();
// ---- Discovery (Public) ----
router.get('/', getAllSkills);
router.get('/search', validateQuery(searchSkillSchema), searchSkills);
router.get('/categories', getSkillCategories);
// ---- Admin Management ----
router.post('/', requireAuth, requireRole(['admin']), validateRequest(createSkillSchema), createSkill);
export default router;
