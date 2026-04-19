import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validateRequest, validateQuery } from '../middleware/validate.middleware.js';
import { createEventSchema, updateEventSchema, eventQuerySchema } from '../validations/event.validation.js';
import { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent, rsvpToEvent, cancelRsvp, checkInRsvp, getEventAttendees, approveRSVP, rejectRSVP, getNearbyEvents, getRecommendedEvents, getEventIcs, getQrCodeData } from '../controllers/event.controller.js';
const router = Router();
// ---- Discovery & Retrievals (Public/Generic) ----
// Validation wrapped queries for safe fetching
router.get('/', validateQuery(eventQuerySchema), getAllEvents);
router.get('/nearby', getNearbyEvents); // Manual validation inside controller for float parses
router.get('/recommendations', requireAuth, getRecommendedEvents);
router.get('/:id', getEventById);
router.get('/:id/calendar.ics', getEventIcs);
// ---- Event Lifecycle Management ----
// Creating requires an explicitly verified club leader or admin and valid body structure
router.post('/', requireAuth, requireRole(['admin']), validateRequest(createEventSchema), createEvent);
router.put('/:id', requireAuth, requireRole(['club_leader', 'admin']), validateRequest(updateEventSchema), updateEvent);
router.delete('/:id', requireAuth, requireRole(['club_leader', 'admin']), deleteEvent);
// ---- RSVP & Attendees Engine ----
router.post('/:id/rsvp', requireAuth, rsvpToEvent);
router.delete('/:id/rsvp', requireAuth, cancelRsvp);
// Organizers check attendee list
router.get('/:id/attendees', requireAuth, getEventAttendees);
// Approval workflows
router.post('/:id/rsvp/:userId/approve', requireAuth, approveRSVP);
router.post('/:id/rsvp/:userId/reject', requireAuth, rejectRSVP);
// QR Code generation route
router.get('/:id/checkin/qr', requireAuth, getQrCodeData);
// QR Checking route. Must be organizer/admin
router.post('/:id/checkin', requireAuth, requireRole(['club_leader', 'admin']), checkInRsvp);
export default router;
