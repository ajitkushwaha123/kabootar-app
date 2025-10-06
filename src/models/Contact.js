import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true, 
    },
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["whatsapp_ad", "direct_message", "imported", "manual"], 
      default: "direct_message",
    },
  },
  { timestamps: true }
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
