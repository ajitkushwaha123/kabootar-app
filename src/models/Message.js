import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
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
      enum: ["agent", "admin", "system", "user"],
      required: true,
    },
    whatsappMessageId: {
      type: String,
      default: null,
    },
    messageType: {
      type: String,
      enum: [
        "text",
        "reaction",
        "image",
        "sticker",
        "file",
        "audio",
        "video",
        "location",
        "contacts",
        "document",
        "unsupported",
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

    sticker: {
      id: { type: String },
      link: { type: String },
      mime_type: { type: String },
      sha256: { type: String },
    },

    video: {
      id: { type: String },
      link: { type: String },
      caption: { type: String },
      mime_type: { type: String },
      sha256: { type: String },
    },

    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      name: { type: String },
      address: { type: String },
    },

    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],

    document: {
      id: { type: String },
      link: { type: String },
      filename: { type: String },
      mime_type: { type: String },
      sha256: { type: String },
    },

    unsupported: {
      code: { type: Number },
      title: { type: String },
      message: { type: String },
      details: { type: String },
    },

    // 🔁 Reply reference
    context: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // ↔️ Direction
    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: true,
    },

    // 🕓 Status
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "read", "failed", "received"],
      default: "sent",
    },

    // 🗑️ Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },

    // 🧾 Metadata
    metadata: {
      type: Object,
      default: {},
    },

    // ⏱️ WhatsApp timestamp
    timestamp: {
      type: Date,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔍 Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ organizationId: 1 });
messageSchema.index({ organizationId: 1, direction: 1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
