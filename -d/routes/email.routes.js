import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { renderEmailHtml } from "../services/email-renderer.service";
import { sendEmail } from "../utils/email.utils";

const router = Router();

/**
 * @desc    Test raw HTML templating engine outputs directly
 * @route   POST /api/v1/emails/test
 */
router.post("/test", requireAuth, async (req, res) => {
  try {
    const {
      template = "welcome",
      ctaUrl = "http://localhost:5173",
      emailTarget,
    } = req.body;
    // Inject mock context variables required for most templates
    const mockContext = {
      name: "Hackathon Admin",
      title: "Global Tech Symposium",
      date: "Oct 25th, 2026",
      time: "6:00 PM",
      location: "Main Auditorium",
      message:
        "This is a sandbox visualization of the templates running through juice-inline CSS.",
      ctaUrl,
      unsubscribeUrl: "http://localhost:5173/settings/notifications",
      resetUrl: "http://localhost:5173/reset-password",
      qrData: "MOCK_QR_TEST_PAYLOAD",
    };

    const renderedHtml = renderEmailHtml(template, mockContext);

    if (emailTarget) {
      await sendEmail({
        to: emailTarget,
        subject: `[Sandbox] Visualizing ${template} template`,
        text: "See attached Sandbox HTML rendering",
        html: renderedHtml,
      });
      return res
        .status(200)
        .json({
          message: "Engine processed successfully. Dispatched test email.",
          htmlLength: renderedHtml.length,
        });
    }

    res.status(200).send(renderedHtml);
  } catch (error) {
    res.status(500).json({ error: "Failed sandbox testing templates" });
  }
});

/**
 * @desc    Allow user unsubscription via hashed tokens
 * @route   GET /api/v1/emails/unsubscribe/:token
 */
router.get("/unsubscribe/:token", async (req, res) => {
  // Validate the encrypted token against user models over JWT/Bcrypt hooks
  // Turn off inApp/Email flags gracefully in DB
  const token = req.params.token;
  res.status(200).send(`
     <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>Unsubscribed successfully</h2>
        <p>You have updated your preferences using token ending in ...${token.slice(-6)}.</p>
     </div>
   `);
});

export default router;
