import mongoose, { Schema } from "mongoose";

const TeamProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    leader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    requiredSkills: [
      {
        skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
        proficiencyDesired: String,
      },
    ],
    pendingRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    associatedEvent: { type: Schema.Types.ObjectId, ref: "Event" },
    deadline: Date,
    status: {
      type: String,
      enum: ["open", "full", "completed"],
      default: "open",
    },
  },
  { timestamps: true },
);

export const TeamProject = mongoose.model("TeamProject", TeamProjectSchema);
