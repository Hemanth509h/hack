import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import juice from 'juice';

// Cache for compiled handlebars instances to prevent I/O disk thrashing during massive bulk-sends
const templateCache: Record<string, HandlebarsTemplateDelegate> = {};

export const renderEmailHtml = (templateName: string, context: Record<string, any>): string => {
  try {
    let compiledTemplate = templateCache[templateName];

    // Read and compile from disk if not heavily cached already
    if (!compiledTemplate) {
      const filePath = path.join(__dirname, '..', 'email-templates', `${templateName}.hbs`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`[email-renderer]: Template ${templateName}.hbs not found. Falling back to explicit strings.`);
        return ''; 
      }

      const rawSource = fs.readFileSync(filePath, 'utf-8');
      compiledTemplate = Handlebars.compile(rawSource);
      templateCache[templateName] = compiledTemplate;
    }

    // Step 1: Push context variables into the HTML layout directly
    const rawHtml = compiledTemplate(context);

    // Step 2: Use Juice engine to map <style> contents to <div style="..."> inline objects for GMail/Outlook
    const inlinedHtml = juice(rawHtml);

    return inlinedHtml;
  } catch (error) {
    console.error(`[email-renderer]: Failure rendering ${templateName}:`, error);
    return `<p>${context.message || 'Check your notifications on the platform.'}</p>`;
  }
};
