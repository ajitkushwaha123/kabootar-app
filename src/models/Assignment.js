import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },
    agentId: {
      type: String, // Clerk userId
      required: true,
    },
    role: {
      type: String,
      enum: ["primary", "backup", "viewer"],
      default: "primary",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    unassignedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Indexes for performance
assignmentSchema.index({ agentId: 1, status: 1 });
assignmentSchema.index({ leadId: 1, status: 1 });
assignmentSchema.index({ conversationId: 1, status: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
