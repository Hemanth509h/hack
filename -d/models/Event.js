import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    club: { type: Schema.Types.ObjectId, ref: "Club", index: true },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    locationDetails: String,
    date: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    capacity: Number,
    rsvpCount: { type: Number, default: 0 },
    coverImage: String,
    tags: [{ type: String, trim: true, lowercase: true }],
    targetAudience: {
      majors: [String],
      years: [Number],
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
  },
  { timestamps: true },
);

// Text indices
EventSchema.index({ title: "text", description: "text", tags: "text" });
// Compound indices for fast feed ranking
EventSchema.index({ status: 1, date: 1 });
EventSchema.index({ category: 1, date: 1 });

export const Event = mongoose.model("Event", EventSchema);
