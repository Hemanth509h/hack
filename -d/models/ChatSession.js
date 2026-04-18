import mongoose, { Schema } from "mongoose";

const ChatSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["system", "user", "assistant", "tool"],
          required: true,
        },
        content: { type: String, required: false },
        name: String,
        tool_call_id: String,
        tool_calls: Schema.Types.Mixed,
      },
    ],
    lastInteraction: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Optional: Expire idle sessions after 7 days
ChatSessionSchema.index(
  { lastInteraction: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 },
);

export const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);
