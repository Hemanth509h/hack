import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
    attachments: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    category: {
      type: String,
      enum: ["general", "club_update", "event_hype", "academic"],
      default: "general",
    },
    clubContext: { type: Schema.Types.ObjectId, ref: "Club" },
  },
  { timestamps: true },
);

export const Post = mongoose.model("Post", PostSchema);
