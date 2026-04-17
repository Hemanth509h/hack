"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const event_validation_1 = require("../validations/event.validation");
const event_controller_1 = require("../controllers/event.controller");
const router = (0, express_1.Router)();
// ---- Discovery & Retrievals (Public/Generic) ----
// Validation wrapped queries for safe fetching
router.get('/', (0, validate_middleware_1.validateQuery)(event_validation_1.eventQuerySchema), event_controller_1.getAllEvents);
router.get('/nearby', event_controller_1.getNearbyEvents); // Manual validation inside controller for float parses
router.get('/recommendations', auth_middleware_1.requireAuth, event_controller_1.getRecommendedEvents);
router.get('/:id', event_controller_1.getEventById);
router.get('/:id/calendar.ics', event_controller_1.getEventIcs);
// ---- Event Lifecycle Management ----
// Creating requires an explicitly verified club leader or admin and valid body structure
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['club_leader', 'admin']), (0, validate_middleware_1.validateRequest)(event_validation_1.createEventSchema), event_controller_1.createEvent);
router.put('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['club_leader', 'admin']), (0, validate_middleware_1.validateRequest)(event_validation_1.updateEventSchema), event_controller_1.updateEvent);
router.delete('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['club_leader', 'admin']), event_controller_1.deleteEvent);
// ---- RSVP & Attendees Engine ----
router.post('/:id/rsvp', auth_middleware_1.requireAuth, event_controller_1.rsvpToEvent);
router.delete('/:id/rsvp', auth_middleware_1.requireAuth, event_controller_1.cancelRsvp);
// Organizers check attendee list
router.get('/:id/attendees', auth_middleware_1.requireAuth, event_controller_1.getEventAttendees);
// QR Code generation route
router.get('/:id/checkin/qr', auth_middleware_1.requireAuth, event_controller_1.getQrCodeData);
// QR Checking route. Must be organizer/admin
router.post('/:id/checkin', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)(['club_leader', 'admin']), event_controller_1.checkInRsvp);
exports.default = router;
