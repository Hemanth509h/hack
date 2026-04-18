"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const club_validation_1 = require("../validations/club.validation");
const club_controller_1 = require("../controllers/club.controller");
const router = (0, express_1.Router)();
// ---- Discovery (Public) ----
router.get('/', (0, validate_middleware_1.validateQuery)(club_validation_1.clubQuerySchema), club_controller_1.getAllClubs);
router.get('/featured', club_controller_1.getFeaturedClubs);
router.get('/:id', club_controller_1.getClubById);
// ---- Club Management ----
router.post('/', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(club_validation_1.createClubSchema), club_controller_1.createClub);
router.put('/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(club_validation_1.updateClubSchema), club_controller_1.updateClub);
router.delete('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['admin']), club_controller_1.deactivateClub);
// ---- Membership Workflows ----
router.post('/:id/join', auth_middleware_1.requireAuth, club_controller_1.joinClub);
router.delete('/:id/leave', auth_middleware_1.requireAuth, club_controller_1.leaveClub);
router.get('/:id/members', auth_middleware_1.requireAuth, club_controller_1.getClubMembers);
router.put('/:id/members/:userId/role', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(club_validation_1.updateMemberRoleSchema), club_controller_1.updateMemberRole);
router.post('/:id/members/:userId/approve', auth_middleware_1.requireAuth, club_controller_1.approveMember);
router.post('/:id/members/:userId/reject', auth_middleware_1.requireAuth, club_controller_1.rejectMember);
// ---- Analytics & Broadcasting ----
router.post('/:id/announcements', auth_middleware_1.requireAuth, (0, validate_middleware_1.validateRequest)(club_validation_1.announcementSchema), club_controller_1.sendClubAnnouncement);
router.get('/:id/analytics', auth_middleware_1.requireAuth, club_controller_1.getClubAnalytics);
exports.default = router;
