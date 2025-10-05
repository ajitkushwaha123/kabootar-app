import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    organizationId: {
      type: String, // Clerk orgId
      required: true,
    },
    participants: {
      type: [String], // Clerk userIds of assigned agents
      default: [],
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["open", "closed", "archived"],
      default: "open",
    },
    tags: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ organizationId: 1, lastMessageAt: -1 });
conversationSchema.index({ leadId: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({
  organizationId: 1,
  unreadCount: -1,
  lastMessageAt: -1,
});
conversationSchema.index({
  organizationId: 1,
  isDeleted: 1,
  lastMessageAt: -1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
