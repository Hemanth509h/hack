"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const skill_validation_1 = require("../validations/skill.validation");
const skill_controller_1 = require("../controllers/skill.controller");
const router = (0, express_1.Router)();
// ---- Discovery (Public) ----
router.get('/', skill_controller_1.getAllSkills);
router.get('/search', (0, validate_middleware_1.validateQuery)(skill_validation_1.searchSkillSchema), skill_controller_1.searchSkills);
router.get('/categories', skill_controller_1.getSkillCategories);
// ---- Admin Management ----
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['admin']), (0, validate_middleware_1.validateRequest)(skill_validation_1.createSkillSchema), skill_controller_1.createSkill);
exports.default = router;
