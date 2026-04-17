"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
// Expecting a multipart-form payload with field-name 'image'
router.post('/image', auth_middleware_1.requireAuth, upload_middleware_1.uploadSettings.single('image'), upload_controller_1.uploadSingleImage);
router.delete('/:publicId(*)', auth_middleware_1.requireAuth, upload_controller_1.deleteImage);
exports.default = router;
