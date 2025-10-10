import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    contactId: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    organizationId: {
      type: String, // Clerk orgId
      required: true,
      index: true,
      trim: true,
    },
    participants: {
      type: [String], // Clerk userIds of assigned agents
      default: [],
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "archived"],
      default: "open",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// 🧩 Compound Indexes for efficient queries
conversationSchema.index({ organizationId: 1, lastMessageAt: -1 });
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

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
