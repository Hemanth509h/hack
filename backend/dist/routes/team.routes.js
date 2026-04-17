"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const team_validation_1 = require("../validations/team.validation");
const team_controller_1 = require("../controllers/team.controller");
const router = (0, express_1.Router)();
// All team routes require authentication
router.use(auth_middleware_1.requireAuth);
// ---- Matching Engine ----
router.get('/matches', team_controller_1.getMatches);
// ---- My Projects ----
router.get('/my-projects', team_controller_1.getMyProjects);
// ---- Browse Open Projects ----
router.get('/browse', (0, validate_middleware_1.validateQuery)(team_validation_1.browseQuerySchema), team_controller_1.browseProjects);
router.get('/requests', team_controller_1.getIncomingRequests);
// ---- Project CRUD ----
router.post('/projects', (0, validate_middleware_1.validateRequest)(team_validation_1.createProjectSchema), team_controller_1.createProject);
router.get('/projects/:id', team_controller_1.getProject);
router.put('/projects/:id', (0, validate_middleware_1.validateRequest)(team_validation_1.updateProjectSchema), team_controller_1.updateProject);
router.delete('/projects/:id', team_controller_1.deleteProject);
// ---- Join Requests ----
router.post('/projects/:id/request', (0, validate_middleware_1.validateRequest)(team_validation_1.requestJoinSchema), team_controller_1.requestToJoin);
router.put('/requests/:id/accept', team_controller_1.acceptRequest);
router.put('/requests/:id/decline', team_controller_1.declineRequest);
exports.default = router;
