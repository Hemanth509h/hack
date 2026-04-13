import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateRequest, validateQuery } from '../middleware/validate.middleware';
import { createEventSchema, updateEventSchema, eventQuerySchema } from '../validations/event.validation';
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  cancelRsvp,
  checkInRsvp,
  getEventAttendees,
  getNearbyEvents,
  getRecommendedEvents
} from '../controllers/event.controller';

const router = Router();

// ---- Discovery & Retrievals (Public/Generic) ----
// Validation wrapped queries for safe fetching
router.get('/', validateQuery(eventQuerySchema), getAllEvents);
router.get('/nearby', getNearbyEvents); // Manual validation inside controller for float parses
router.get('/recommendations', requireAuth, getRecommendedEvents);
router.get('/:id', getEventById);

// ---- Event Lifecycle Management ----
// Creating requires an explicitly verified club leader or admin and valid body structure
router.post(
  '/', 
  requireAuth, 
  requireRole(['club_leader', 'admin']), 
  validateRequest(createEventSchema), 
  createEvent
);

router.put(
  '/:id', 
  requireAuth, 
  requireRole(['club_leader', 'admin']), 
  validateRequest(updateEventSchema), 
  updateEvent
);

router.delete('/:id', requireAuth, requireRole(['club_leader', 'admin']), deleteEvent);

// ---- RSVP & Attendees Engine ----
router.post('/:id/rsvp', requireAuth, rsvpToEvent);
router.delete('/:id/rsvp', requireAuth, cancelRsvp);

// Organizers check attendee list
router.get('/:id/attendees', requireAuth, getEventAttendees);

// QR Checking route. Must be organizer/admin
router.post('/:id/checkin', requireAuth, requireRole(['club_leader', 'admin']), checkInRsvp);

export default router;
