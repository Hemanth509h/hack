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
exports.processChatMessage = void 0;
const ChatSession_1 = require("../models/ChatSession");
const aiFunctions = __importStar(require("./ai.functions"));
/** ----------------------------------------------------------------
 *  MOCK AI ASSISTANT (NEXUS)
 *  Replaces OpenAI with rule-based logic to avoid API crashes.
 * ---------------------------------------------------------------- */
const GREETINGS = ["hi", "hello", "hey", "nexus", "help"];
const EVENT_KEYWORDS = ["event", "happen", "today", "week", "month", "fair", "hackathon"];
const CLUB_KEYWORDS = ["club", "join", "group", "society", "interest"];
const CAMPUS_KEYWORDS = ["dining", "hours", "map", "library", "calendar", "break"];
const processChatMessage = async (userId, userMessage, res) => {
    try {
        const msg = userMessage.toLowerCase();
        // 1. Retrieve or Create Session (Audit only, no AI consumption)
        let session = await ChatSession_1.ChatSession.findOne({ userId });
        if (!session) {
            session = await ChatSession_1.ChatSession.create({
                userId,
                messages: [{ role: 'system', content: "Nexus Mock Mode" }]
            });
        }
        session.messages.push({ role: 'user', content: userMessage });
        await session.save();
        // 2. Determine Response via Keyword Matching
        let responseText = "";
        let dataResults = null;
        if (EVENT_KEYWORDS.some(k => msg.includes(k))) {
            responseText = "I've searched the campus calendar for you. Here are some upcoming events:";
            dataResults = await aiFunctions.searchEvents({ query: userMessage });
        }
        else if (CLUB_KEYWORDS.some(k => msg.includes(k))) {
            responseText = "Sure! I found these clubs that might interest you:";
            dataResults = await aiFunctions.findClubs({ query: userMessage });
        }
        else if (CAMPUS_KEYWORDS.some(k => msg.includes(k))) {
            responseText = "Here is the campus information I found regarding your query:";
            dataResults = await aiFunctions.getCampusInfo({ topic: userMessage });
        }
        else if (GREETINGS.some(k => msg.includes(k))) {
            responseText = "Hello! I'm Nexus, your campus assistant. I can help you find events, clubs, or campus information. What's on your mind?";
        }
        else {
            responseText = "I'm not quite sure about that, but I can help you find clubs, events, or general campus info! Try asking 'What events are happening today?'";
        }
        // 3. Simulate Streaming
        const fullResponse = dataResults
            ? `${responseText}\n\n${JSON.stringify(dataResults, null, 2)}`
            : responseText;
        // Send the response in chunks to simulate the AI feel
        const words = fullResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
            res.write(words[i] + (i === words.length - 1 ? '' : ' '));
            // Small delay to simulate "thinking/typing"
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        // Save final assistant response
        session.messages.push({ role: 'assistant', content: fullResponse });
        await session.save();
        res.end();
    }
    catch (error) {
        console.error("[ai-service] Error in mock processChat:", error);
        res.status(500).write("I'm having trouble accessing the campus database right now. Please try again later.");
        res.end();
    }
};
exports.processChatMessage = processChatMessage;
