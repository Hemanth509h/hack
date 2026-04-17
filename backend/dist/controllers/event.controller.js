"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQrCodeData = exports.getEventIcs = exports.getRecommendedEvents = exports.getNearbyEvents = exports.getEventAttendees = exports.checkInRsvp = exports.cancelRsvp = exports.rsvpToEvent = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.createEvent = exports.getAllEvents = void 0;
const Event_1 = require("../models/Event");
const RSVP_1 = require("../models/RSVP");
const User_1 = require("../models/User");
const notification_service_1 = require("../services/notification.service");
const socket_1 = require("../config/socket");
/**
 * @desc    Get all events with filters, search, and pagination
 * @route   GET /api/v1/events
 */
const getAllEvents = async (req, res) => {
    try {
        const { page, limit, search, category, startDate, endDate, club, sortBy } = req.query;
        const query = { status: 'published' };
        // Full-text search
        if (search) {
            query.$text = { $search: search };
        }
        // Exact Match Filters
        if (category)
            query.category = category;
        if (club)
            query.club = club;
        // Date Range filters
        if (startDate || endDate) {
            query.date = {};
            if (startDate)
                query.date.$gte = new Date(startDate);
            if (endDate)
                query.date.$lte = new Date(endDate);
        }
        // Sort mapping
        let sortOptions = {};
        if (sortBy === 'date')
            sortOptions = { date: 1 };
        else if (sortBy === 'popularity')
            sortOptions = { rsvpCount: -1 };
        else if (sortBy === 'newest')
            sortOptions = { createdAt: -1 };
        else
            sortOptions = { date: 1 };
        const events = await Event_1.Event.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('organizer', 'name avatar')
            .populate('location', 'name buildingCode');
        const total = await Event_1.Event.countDocuments(query);
        res.json({
            events,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch events', details: error.message });
    }
};
exports.getAllEvents = getAllEvents;
/**
 * @desc    Create new event
 * @route   POST /api/v1/events
 */
const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        // Check if user is club leader or admin. In a strict system, this check might exist in route middleware.
        if (req.user?.role === 'student' && !eventData.club) {
            // Technically pure students shouldn't organize official campus events without a club context generally, 
            // but we allow it if they are just standard users per the simplified PRD, or limit to club_leader+
            return res.status(403).json({ error: 'Must be an official club leader to broadcast events.' });
        }
        const newEvent = await Event_1.Event.create({
            ...eventData,
            organizer: req.user?.userId,
        });
        // Notify users with matching interests or majors
        const usersToNotify = await User_1.User.find({
            _id: { $ne: req.user?.userId },
            $or: [
                { interests: newEvent.category },
                { major: { $in: newEvent.targetAudience?.majors || [] } }
            ]
        }).select('_id');
        if (usersToNotify.length > 0) {
            const recipientIds = usersToNotify.map(u => String(u._id));
            // Multi-channel bulk delivery (DB + Email + Push)
            await (0, notification_service_1.sendBulkNotifications)(recipientIds, {
                type: 'event_update',
                title: 'New Event Matching Your Interests! 🚀',
                message: `Check out "${newEvent.title}" happening on ${new Date(newEvent.date).toLocaleDateString()}.`,
                ctaUrl: `${process.env.FRONTEND_URL}/events/${newEvent._id}`,
                dataPayload: { eventId: newEvent._id }
            });
            // Targeted real-time socket emission
            (0, socket_1.emitNewEventMatch)(recipientIds, newEvent);
        }
        res.status(201).json({ message: 'Event created and matches notified', event: newEvent });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create event', details: error.message });
    }
};
exports.createEvent = createEvent;
/**
 * @desc    Get event by ID
 * @route   GET /api/v1/events/:id
 */
const getEventById = async (req, res) => {
    try {
        const event = await Event_1.Event.findById(req.params.id)
            .populate('organizer', 'name avatar role')
            .populate('club', 'name logo')
            .populate('location', 'name description coordinates buildingCode');
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error retrieving event details' });
    }
};
exports.getEventById = getEventById;
/**
 * @desc    Update Event
 * @route   PUT /api/v1/events/:id
 */
const updateEvent = async (req, res) => {
    try {
        const event = await Event_1.Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Ownership check
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }
        const updatedEvent = await Event_1.Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // Emit status change if status was updated
        if (req.body.status && updatedEvent) {
            (0, socket_1.emitEventStatusChange)(req.params.id, req.body.status);
        }
        res.json({ message: 'Event updated', event: updatedEvent });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};
exports.updateEvent = updateEvent;
/**
 * @desc    Delete Event
 * @route   DELETE /api/v1/events/:id
 */
const deleteEvent = async (req, res) => {
    try {
        const event = await Event_1.Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this event' });
        }
        await event.deleteOne();
        // Cascade delete side-effects (clean up RSVPs) could be added to Mongoose pre('remove') hooks
        res.json({ message: 'Event permanently deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
exports.deleteEvent = deleteEvent;
/**
 * @desc    RSVP to event
 * @route   POST /api/v1/events/:id/rsvp
 */
const rsvpToEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;
        const event = await Event_1.Event.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.status !== 'published') {
            return res.status(400).json({ error: 'Cannot RSVP to an unpublished event' });
        }
        if (event.capacity && event.rsvpCount >= event.capacity) {
            // Logic for waitlist could execute here
            return res.status(400).json({ error: 'Event is fully booked' });
        }
        const existingRsvp = await RSVP_1.RSVP.findOne({ user: userId, event: eventId });
        if (existingRsvp) {
            if (existingRsvp.status === 'cancelled') {
                existingRsvp.status = 'attending';
                await existingRsvp.save();
                const updatedEvent = await Event_1.Event.findById(eventId).select('rsvpCount');
                (0, socket_1.emitRsvpUpdate)(eventId, updatedEvent?.rsvpCount ?? 0, 'added');
                return res.json({ message: 'RSVP restored', status: 'attending' });
            }
            return res.status(400).json({ error: 'You are already registered for this event' });
        }
        const newRsvp = await RSVP_1.RSVP.create({ user: userId, event: eventId, status: 'attending' });
        // Fetch updated count and emit to event room for real-time badge update
        const updatedEvent = await Event_1.Event.findById(eventId).select('rsvpCount');
        (0, socket_1.emitRsvpUpdate)(eventId, updatedEvent?.rsvpCount ?? 0, 'added');
        res.status(201).json({ message: 'RSVP confirmed', rsvp: newRsvp });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process RSVP' });
    }
};
exports.rsvpToEvent = rsvpToEvent;
/**
 * @desc    Cancel RSVP
 * @route   DELETE /api/v1/events/:id/rsvp
 */
const cancelRsvp = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;
        const rsvp = await RSVP_1.RSVP.findOneAndDelete({ user: userId, event: eventId, status: 'attending' });
        if (!rsvp)
            return res.status(404).json({ error: 'Active RSVP not found' });
        const updatedEvent = await Event_1.Event.findById(eventId).select('rsvpCount');
        (0, socket_1.emitRsvpUpdate)(eventId, updatedEvent?.rsvpCount ?? 0, 'cancelled');
        res.json({ message: 'RSVP successfully cancelled' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to cancel RSVP' });
    }
};
exports.cancelRsvp = cancelRsvp;
/**
 * @desc    QR Code Check-in
 * @route   POST /api/v1/events/:id/checkin
 */
const checkInRsvp = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { data: rawData, signature } = req.body;
        let targetUserId;
        // Support both manual bypass checkin (just raw userId) OR highly secure QR checks
        if (!signature) {
            // Manual mode fallback for organizers pushing buttons
            targetUserId = req.body.userId;
            if (!targetUserId)
                return res.status(400).json({ error: 'QR Payload or Manual userId required' });
        }
        else {
            // Cryptographic QR verification
            const secret = process.env.QR_SECRET || 'dev_fallback_secret';
            const expectedSig = crypto.createHmac('sha256', secret).update(rawData).digest('hex');
            if (signature !== expectedSig) {
                return res.status(403).json({ error: 'Invalid or forged QR signature.' });
            }
            const parsedData = JSON.parse(rawData);
            targetUserId = parsedData.userId;
            // Verify timestamp freshness (e.g. valid for 24 hours only, or 10 mins?)
            // Using 24hrs for events to be safe
            const qrAge = Date.now() - parsedData.timestamp;
            if (qrAge > 24 * 60 * 60 * 1000) {
                return res.status(400).json({ error: 'QR Code expired. Please refresh your code.' });
            }
        }
        // Must be organizer or admin to check people in
        const event = await Event_1.Event.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to operate check-ins' });
        }
        const rsvp = await RSVP_1.RSVP.findOne({ user: targetUserId, event: eventId });
        if (!rsvp)
            return res.status(404).json({ error: 'User does not have an RSVP for this event' });
        if (rsvp.isCheckedIn)
            return res.status(400).json({ error: 'User is already checked in' });
        rsvp.isCheckedIn = true;
        rsvp.checkInTime = new Date();
        await rsvp.save();
        res.json({ message: 'User successfully checked in', rsvp, userId: targetUserId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to check in user' });
    }
};
exports.checkInRsvp = checkInRsvp;
/**
 * @desc    List Attendees
 * @route   GET /api/v1/events/:id/attendees
 */
const getEventAttendees = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event_1.Event.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Restrict visibility
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to view attendee list' });
        }
        const rsvps = await RSVP_1.RSVP.find({ event: eventId, status: 'attending' })
            .populate('user', 'name avatar major graduationYear email')
            .sort({ createdAt: 1 });
        res.json({ attendees: rsvps });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to load attendees' });
    }
};
exports.getEventAttendees = getEventAttendees;
/**
 * @desc    Location-based Discovery ($geoNear)
 * @route   GET /api/v1/events/nearby
 */
const getNearbyEvents = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude (lat) and Longitude (lng) are required' });
        }
        // Default to 5000 meters (5km) radius
        const maxDistance = radius ? parseInt(radius) : 5000;
        const nearbyEvents = await Event_1.Event.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistance,
                    spherical: true,
                    query: { status: 'published', date: { $gte: new Date() } } // Only upcoming published
                }
            },
            {
                $lookup: { localField: 'location', from: 'locations', foreignField: '_id', as: 'locationData' }
            },
            { $sort: { distance: 1 } },
            { $limit: 20 }
        ]);
        res.json({ events: nearbyEvents });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch nearby events', details: error.message });
    }
};
exports.getNearbyEvents = getNearbyEvents;
/**
 * @desc    Personalized recommendations Engine
 * @route   GET /api/v1/events/recommendations
 */
const getRecommendedEvents = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.userId).lean();
        if (!user)
            return res.status(404).json({ error: 'User context invalid' });
        const interests = user.interests || [];
        // Basic recommendation logic: matching categories or tags with user's interests, prioritizing upcoming.
        const recommendations = await Event_1.Event.find({
            status: 'published',
            date: { $gte: new Date() },
            $or: [
                { category: { $in: interests } },
                { tags: { $in: interests } },
                { 'targetAudience.majors': user.major }
            ]
        })
            .sort({ date: 1 })
            .limit(10)
            .populate('location', 'name buildingCode');
        res.json({ events: recommendations });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to load recommendations' });
    }
};
exports.getRecommendedEvents = getRecommendedEvents;
/**
 * @desc    Generate ICS Calendar file
 * @route   GET /api/v1/events/:id/calendar.ics
 */
const ics = __importStar(require("ics"));
const getEventIcs = async (req, res) => {
    try {
        const event = await Event_1.Event.findById(req.params.id)
            .populate('location', 'name buildingCode')
            .populate('organizer', 'name email');
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Ensure we parse the start date properly
        const startDate = new Date(event.date);
        const startObj = [
            startDate.getUTCFullYear(),
            startDate.getUTCMonth() + 1,
            startDate.getUTCDate(),
            startDate.getUTCHours(),
            startDate.getUTCMinutes()
        ];
        const icsEvent = {
            title: event.title,
            description: event.description,
            location: event.location?.name ? `${event.location.name} ${event.location.buildingCode || ''}` : event.locationDetails,
            start: startObj,
            startInputType: 'utc',
            startOutputType: 'utc',
            duration: { minutes: event.durationMinutes || 60 },
            categories: [event.category, ...event.tags],
            status: event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED',
            busyStatus: 'BUSY',
            organizer: { name: event.organizer?.name, email: event.organizer?.email || 'noreply@quad.edu' },
            url: `${process.env.FRONTEND_URL}/events/${event._id}`,
            alarms: [{
                    action: 'display',
                    description: 'Reminder',
                    trigger: { hours: 1, minutes: 0, before: true }
                }]
        };
        ics.createEvent(icsEvent, (error, value) => {
            if (error) {
                return res.status(500).json({ error: 'Calendar generation failed', details: error.message });
            }
            res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="event-${event._id}.ics"`);
            res.send(value);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to export calendar' });
    }
};
exports.getEventIcs = getEventIcs;
/**
 * @desc    Get Secure QR Code Data
 * @route   GET /api/v1/events/:id/checkin/qr
 */
const crypto = __importStar(require("crypto"));
const getQrCodeData = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;
        const rsvp = await RSVP_1.RSVP.findOne({ user: userId, event: eventId, status: 'attending' });
        if (!rsvp)
            return res.status(403).json({ error: 'You do not have an active RSVP for this event.' });
        const timestamp = Date.now();
        const payload = JSON.stringify({ userId, eventId, rsvpId: rsvp._id, timestamp });
        // Create an HMAC signature to prevent forgery
        const secret = process.env.QR_SECRET || 'dev_fallback_secret';
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        res.json({
            data: payload,
            signature
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate QR credentials' });
    }
};
exports.getQrCodeData = getQrCodeData;
