import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true },
);

// Ensure participants are unique and sorted for indexing
ConversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model("Conversation", ConversationSchema);
