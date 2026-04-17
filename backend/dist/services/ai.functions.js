"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampusInfo = exports.findClubs = exports.searchEvents = void 0;
const Event_1 = require("../models/Event");
const Club_1 = require("../models/Club");
const CampusInfo_1 = require("../models/CampusInfo");
/**
 * AI Function: Search for events
 */
const searchEvents = async (args) => {
    try {
        const mongoQuery = { status: 'published' };
        if (args.query)
            mongoQuery.$text = { $search: args.query };
        if (args.category)
            mongoQuery.category = args.category;
        const now = new Date();
        if (args.timeframe === 'today') {
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
            mongoQuery.date = { $gte: now, $lte: endOfDay };
        }
        else if (args.timeframe === 'week') {
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
            mongoQuery.date = { $gte: now, $lte: endOfWeek };
        }
        else {
            mongoQuery.date = { $gte: now }; // default future events
        }
        const events = await Event_1.Event.find(mongoQuery)
            .sort(args.query ? { score: { $meta: 'textScore' } } : { date: 1 })
            .limit(5)
            .select('title description date locationDetails category rsvpCount');
        return events.length ? events : "No events found matching those criteria.";
    }
    catch (error) {
        return "Error searching events. Please try again later.";
    }
};
exports.searchEvents = searchEvents;
/**
 * AI Function: Find clubs
 */
const findClubs = async (args) => {
    try {
        const clubs = await Club_1.Club.find({ status: 'active', $text: { $search: args.query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(3)
            .select('name description category meetingSchedule memberCount');
        return clubs.length ? clubs : "No clubs found matching that description.";
    }
    catch (error) {
        return "Error searching clubs.";
    }
};
exports.findClubs = findClubs;
/**
 * AI Function: Get specific campus info (Dining, FAQ, Calendar)
 */
const getCampusInfo = async (args) => {
    try {
        const info = await CampusInfo_1.CampusInfo.find({ $text: { $search: args.topic } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(1);
        return info.length ? info[0].content : "I couldn't find specific information on that topic in the campus directory.";
    }
    catch (error) {
        return "Error retrieving campus information.";
    }
};
exports.getCampusInfo = getCampusInfo;
