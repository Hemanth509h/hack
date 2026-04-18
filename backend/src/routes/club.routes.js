import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateRequest, validateQuery } from '../middleware/validate.middleware';
import { createClubSchema, updateClubSchema, clubQuerySchema, updateMemberRoleSchema, announcementSchema } from '../validations/club.validation';
import {
  getAllClubs,
  getFeaturedClubs,
  createClub,
  getClubById,
  updateClub,
  deactivateClub,
  joinClub,
  leaveClub,
  getClubMembers,
  updateMemberRole,
  approveMember,
  rejectMember,
  sendClubAnnouncement,
  getClubAnalytics
} from '../controllers/club.controller';

const router = Router();

// ---- Discovery (Public) ----
router.get('/', validateQuery(clubQuerySchema), getAllClubs);
router.get('/featured', getFeaturedClubs);
router.get('/:id', getClubById);

// ---- Club Management ----
router.post('/', requireAuth, validateRequest(createClubSchema), createClub);
router.put('/:id', requireAuth, validateRequest(updateClubSchema), updateClub);
router.delete('/:id', requireAuth, requireRole(['admin']), deactivateClub);

// ---- Membership Workflows ----
router.post('/:id/join', requireAuth, joinClub);
router.delete('/:id/leave', requireAuth, leaveClub);
router.get('/:id/members', requireAuth, getClubMembers);
router.put('/:id/members/:userId/role', requireAuth, validateRequest(updateMemberRoleSchema), updateMemberRole);
router.post('/:id/members/:userId/approve', requireAuth, approveMember);
router.post('/:id/members/:userId/reject', requireAuth, rejectMember);

// ---- Analytics & Broadcasting ----
router.post('/:id/announcements', requireAuth, validateRequest(announcementSchema), sendClubAnnouncement);
router.get('/:id/analytics', requireAuth, getClubAnalytics);

export default router;
