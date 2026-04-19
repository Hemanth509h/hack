import { Event } from '../models/Event.js';
import { RSVP } from '../models/RSVP.js';
import { User } from '../models/User.js';
import { sendBulkNotifications } from '../services/notification.service.js';
import { emitRsvpUpdate, emitEventStatusChange, emitNewEventMatch } from '../config/socket.js';
/**
 * @desc    Get all events with filters, search, and pagination
 * @route   GET /api/v1/events
 */
export const getAllEvents = async (req, res) => {
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
        const events = await Event.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('organizer', 'name avatar')
            .populate('location', 'name buildingCode');
        const total = await Event.countDocuments(query);
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
/**
 * @desc    Create new event (Admin only, assigns student organizer)
 * @route   POST /api/v1/events
 */
export const createEvent = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Only administrators can initialize official campus events.' });
        }
        const { organizerId, ...eventData } = req.body;
        if (!organizerId) {
            return res.status(400).json({ error: 'An event organizer must be assigned.' });
        }
        // Verify organizer exists
        const organizerUser = await User.findById(organizerId);
        if (!organizerUser) {
            return res.status(404).json({ error: 'Assigned organizer not found.' });
        }
        const newEvent = await Event.create({
            ...eventData,
            organizer: organizerId,
        });
        // Notify users with matching interests or majors
        const usersToNotify = await User.find({
            _id: { $ne: req.user?.userId },
            $or: [
                { interests: newEvent.category },
                { major: { $in: newEvent.targetAudience?.majors || [] } }
            ]
        }).select('_id');
        if (usersToNotify.length > 0) {
            const recipientIds = usersToNotify.map(u => String(u._id));
            // Multi-channel bulk delivery (DB + Email + Push)
            await sendBulkNotifications(recipientIds, {
                type: 'event_update',
                title: 'New Event Matching Your Interests! 🚀',
                message: `Check out "${newEvent.title}" happening on ${new Date(newEvent.date).toLocaleDateString()}.`,
                ctaUrl: `${process.env.FRONTEND_URL}/events/${newEvent._id}`,
                dataPayload: { eventId: newEvent._id }
            });
            // Targeted real-time socket emission
            emitNewEventMatch(recipientIds, newEvent);
        }
        res.status(201).json({ message: 'Event created and matches notified', event: newEvent });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create event', details: error.message });
    }
};
/**
 * @desc    Get event by ID
 * @route   GET /api/v1/events/:id
 */
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
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
/**
 * @desc    Update Event
 * @route   PUT /api/v1/events/:id
 */
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Ownership check
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // Emit status change if status was updated
        if (req.body.status && updatedEvent) {
            emitEventStatusChange(req.params.id, req.body.status);
        }
        res.json({ message: 'Event updated', event: updatedEvent });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
};
/**
 * @desc    Delete Event
 * @route   DELETE /api/v1/events/:id
 */
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
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
/**
 * @desc    RSVP to event
 * @route   POST /api/v1/events/:id/rsvp
 */
export const rsvpToEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;
        const event = await Event.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.status !== 'published') {
            return res.status(400).json({ error: 'Cannot RSVP to an unpublished event' });
        }
        if (event.capacity && event.rsvpCount >= event.capacity) {
            // Logic for waitlist could execute here
            return res.status(400).json({ error: 'Event is fully booked' });
        }
        const existingRsvp = await RSVP.findOne({ user: userId, event: eventId });
        if (existingRsvp) {
            if (existingRsvp.status === 'cancelled') {
                existingRsvp.status = 'attending';
                await existingRsvp.save();
                const updatedEvent = await Event.findById(eventId).select('rsvpCount');
                emitRsvpUpdate(eventId, updatedEvent?.rsvpCount ?? 0, 'added');
                return res.json({ message: 'RSVP restored', status: 'attending' });
            }
            return res.status(400).json({ error: 'You are already registered for this event' });
        }
        const newRsvp = await RSVP.create({ user: userId, event: eventId, status: 'pending' });
        res.status(201).json({ message: 'RSVP request sent. Awaiting organizer approval.', rsvp: newRsvp });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process RSVP' });
    }
};
/**
 * @desc    Cancel RSVP
 * @route   DELETE /api/v1/events/:id/rsvp
 */
export const cancelRsvp = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;
        const rsvp = await RSVP.findOneAndDelete({ user: userId, event: eventId, status: 'attending' });
        if (!rsvp)
            return res.status(404).json({ error: 'Active RSVP not found' });
        const updatedEvent = await Event.findById(eventId).select('rsvpCount');
        emitRsvpUpdate(eventId, updatedEvent?.rsvpCount ?? 0, 'cancelled');
        res.json({ message: 'RSVP successfully cancelled' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to cancel RSVP' });
    }
};
/**
 * @desc    QR Code Check-in
 * @route   POST /api/v1/events/:id/checkin
 */
export const checkInRsvp = async (req, res) => {
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
        const event = await Event.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to operate check-ins' });
        }
        const rsvp = await RSVP.findOne({ user: targetUserId, event: eventId });
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
/**
 * @desc    List Attendees
 * @route   GET /api/v1/events/:id/attendees
 */
export const getEventAttendees = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        // Restrict visibility
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to view attendee list' });
        }
        // Determine which statuses to show
        const isAuthorized = event.organizer.toString() === req.user?.userId || req.user?.role === 'admin';
        const statuses = isAuthorized ? ['attending', 'pending'] : ['attending'];
        const rsvps = await RSVP.find({ event: eventId, status: { $in: statuses } })
            .populate('user', 'name avatar major graduationYear email')
            .sort({ status: -1, createdAt: 1 });
        res.json({ attendees: rsvps });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to load attendees' });
    }
};
/**
 * @desc    Approve RSVP
 * @route   POST /api/v1/events/:id/rsvp/:userId/approve
 */
export const approveRSVP = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Only the event organizer can approve RSVPs.' });
        }
        const rsvp = await RSVP.findOne({ user: req.params.userId, event: req.params.id });
        if (!rsvp)
            return res.status(404).json({ error: 'RSVP not found' });
        rsvp.status = 'attending';
        await rsvp.save();
        // Fetch updated count and emit to event room for real-time badge update
        const updatedEvent = await Event.findById(req.params.id).select('rsvpCount');
        emitRsvpUpdate(req.params.id, updatedEvent?.rsvpCount ?? 0, 'added');
        res.json({ message: 'RSVP approved successfully', rsvp });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to approve RSVP' });
    }
};
/**
 * @desc    Reject RSVP
 * @route   POST /api/v1/events/:id/rsvp/:userId/reject
 */
export const rejectRSVP = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.organizer.toString() !== req.user?.userId && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Only the event organizer can reject RSVPs.' });
        }
        const rsvp = await RSVP.findOne({ user: req.params.userId, event: req.params.id });
        if (!rsvp)
            return res.status(404).json({ error: 'RSVP not found' });
        rsvp.status = 'cancelled'; // Or 'rejected' if we had that status
        await rsvp.save();
        res.json({ message: 'RSVP request rejected', rsvp });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to reject RSVP' });
    }
};
/**
 * @desc    Location-based Discovery ($geoNear)
 * @route   GET /api/v1/events/nearby
 */
export const getNearbyEvents = async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude (lat) and Longitude (lng) are required' });
        }
        // Default to 5000 meters (5km) radius
        const maxDistance = radius ? parseInt(radius) : 5000;
        const nearbyEvents = await Event.aggregate([
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
/**
 * @desc    Personalized recommendations Engine
 * @route   GET /api/v1/events/recommendations
 */
export const getRecommendedEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user?.userId).lean();
        if (!user)
            return res.status(404).json({ error: 'User context invalid' });
        const interests = user.interests || [];
        // Basic recommendation logic: matching categories or tags with user's interests, prioritizing upcoming.
        const recommendations = await Event.find({
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
/**
 * @desc    Generate ICS Calendar file
 * @route   GET /api/v1/events/:id/calendar.ics
 */
import * as ics from 'ics';
export const getEventIcs = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
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
/**
 * @desc    Get Secure QR Code Data
 * @route   GET /api/v1/events/:id/checkin/qr
 */
import * as crypto from 'crypto';
export const getQrCodeData = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.userId;
        const rsvp = await RSVP.findOne({ user: userId, event: eventId, status: 'attending' });
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
