import mongoose, { Schema } from "mongoose";

const ClubSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    logo: String,
    coverImage: String,
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
      index: true,
    },
    socialLinks: {
      website: String,
      instagram: String,
      discord: String,
    },
    meetingSchedule: String,
    tags: [{ type: String, trim: true, lowercase: true }],
    memberCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Text index to support full-text discovery
ClubSchema.index({ name: "text", description: "text", tags: "text" });

export const Club = mongoose.model("Club", ClubSchema);
