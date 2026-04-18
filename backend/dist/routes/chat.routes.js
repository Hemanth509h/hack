"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
// Get message history for any room type
router.get('/:roomType/:roomId', chat_controller_1.getMessageHistory);
// Get all conversations for the user
router.get('/conversations', chat_controller_1.getConversations);
// Find or create a conversation
router.post('/conversations', chat_controller_1.getOrCreateConversation);
// Delete a specific message
router.delete('/messages/:id', chat_controller_1.deleteMessage);
exports.default = router;
