import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    wa_id: { type: String },
    type: { type: String },
  },
  { _id: false }
);

const nameSchema = new mongoose.Schema(
  {
    formatted_name: { type: String },
    first_name: { type: String },
    last_name: { type: String },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },

    name: nameSchema,
    phone: [phoneSchema],

    source: {
      type: String,
      enum: [
        "whatsapp_contact_shared",
        "whatsapp_ad",
        "direct_message_received",
        "imported",
        "manual_contacted",
      ],
      default: "whatsapp_contact_shared",
    },

    wa_id: { type: String, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

    primaryPhone: { type: String, index: true },
    primaryName: { type: String, trim: true },
  },
  { timestamps: true }
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
