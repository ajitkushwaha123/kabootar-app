import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    leadId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Lead",
      type: String,
      required: true,
    },
    conversationId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Conversation",
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      default: null,
    },
    organizationId: {
      type: String,
      required: true,
    },
    senderType: {
      type: String,
      enum: ["agent", "admin", "system"],
      required: true,
    },
    messageType: {
      type: String,
      enum: [
        "text",
        "reaction",
        "image",
        "file",
        "audio",
        "video",
        "location",
        "contact",
      ],
      default: "text",
    },
    text: {
      preview_url: { type: Boolean, default: false },
      body: { type: String },
    },
    reaction: {
      message_id: { type: String },
      emoji: { type: String },
    },
    image: {
      link: { type: String },
      caption: { type: String },
    },
    context: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "read", "failed"],
      default: "sent",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
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

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ leadId: 1 });
messageSchema.index({ organizationId: 1 });
messageSchema.index({ organizationId: 1, status: 1, direction: 1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
