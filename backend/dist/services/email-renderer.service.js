"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmailHtml = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const juice_1 = __importDefault(require("juice"));
// Cache for compiled handlebars instances to prevent I/O disk thrashing during massive bulk-sends
const templateCache = {};
const renderEmailHtml = (templateName, context) => {
    try {
        let compiledTemplate = templateCache[templateName];
        // Read and compile from disk if not heavily cached already
        if (!compiledTemplate) {
            const filePath = path_1.default.join(__dirname, '..', 'email-templates', `${templateName}.hbs`);
            if (!fs_1.default.existsSync(filePath)) {
                console.warn(`[email-renderer]: Template ${templateName}.hbs not found. Falling back to explicit strings.`);
                return '';
            }
            const rawSource = fs_1.default.readFileSync(filePath, 'utf-8');
            compiledTemplate = handlebars_1.default.compile(rawSource);
            templateCache[templateName] = compiledTemplate;
        }
        // Step 1: Push context variables into the HTML layout directly
        const rawHtml = compiledTemplate(context);
        // Step 2: Use Juice engine to map <style> contents to <div style="..."> inline objects for GMail/Outlook
        const inlinedHtml = (0, juice_1.default)(rawHtml);
        return inlinedHtml;
    }
    catch (error) {
        console.error(`[email-renderer]: Failure rendering ${templateName}:`, error);
        return `<p>${context.message || 'Check your notifications on the platform.'}</p>`;
    }
};
exports.renderEmailHtml = renderEmailHtml;
