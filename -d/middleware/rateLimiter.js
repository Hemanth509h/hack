import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 10, // Limit each IP to 10 requests per windowMs for auth routes
  message: {
    status: 429,
    error:
      "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: "draft-7", // Draft-7: combined RateLimit header
  legacyHeaders: false, // Disable X-RateLimit-* headers
});
