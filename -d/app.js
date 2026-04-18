import express from "express";
import cors from "cors";
import passport from "./config/passport";

import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import clubRoutes from "./routes/club.routes";
import userRoutes from "./routes/user.routes";
import skillRoutes from "./routes/skill.routes";
import teamRoutes from "./routes/team.routes";
import notificationRoutes from "./routes/notification.routes";
import chatRoutes from "./routes/chat.routes";
import searchRoutes from "./routes/search.routes";
import discoveryRoutes from "./routes/discovery.routes";
import adminRoutes from "./routes/admin.routes";
import aiRoutes from "./routes/ai.routes";
import uploadRoutes from "./routes/upload.routes";
import emailRoutes from "./routes/email.routes";
import analyticsRoutes from "./routes/analytics.routes";
import locationRoutes from "./routes/location.routes";
import feedRoutes from "./routes/feed.routes";
import socialRoutes from "./routes/social.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/clubs", clubRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/skills", skillRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/discovery", discoveryRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/emails", emailRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/social", socialRoutes);

export default app;
