import mongoose, { Schema } from "mongoose";

const CampusInfoSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["dining", "academic", "faq", "general"],
      required: true,
      index: true,
    },
    topic: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    tags: [{ type: String, lowercase: true, trim: true }],
  },
  { timestamps: true },
);

// Text index for standard search capability
CampusInfoSchema.index({ topic: "text", content: "text", tags: "text" });

export const CampusInfo = mongoose.model("CampusInfo", CampusInfoSchema);
