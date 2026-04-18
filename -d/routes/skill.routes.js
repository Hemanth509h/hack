import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import {
  validateRequest,
  validateQuery,
} from "../middleware/validate.middleware";
import {
  createSkillSchema,
  searchSkillSchema,
} from "../validations/skill.validation";
import {
  getAllSkills,
  searchSkills,
  getSkillCategories,
  createSkill,
} from "../controllers/skill.controller";

const router = Router();

// ---- Discovery (Public) ----
router.get("/", getAllSkills);
router.get("/search", validateQuery(searchSkillSchema), searchSkills);
router.get("/categories", getSkillCategories);

// ---- Admin Management ----
router.post(
  "/",
  requireAuth,
  requireRole(["admin"]),
  validateRequest(createSkillSchema),
  createSkill,
);

export default router;
