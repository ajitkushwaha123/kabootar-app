import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: null },
    organizationId: { type: String, required: true }, // Clerk orgId
    source: { type: String, default: "meta_ads" },
    campaignId: { type: String, default: null },
    adId: { type: String, default: null },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "converted", "closed"],
      default: "new",
    },
    assignedTo: {
      type: [String], // Clerk userIds
      default: [],
    },
    metadata: {
      type: Object,
      default: {},
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

leadSchema.index({ organizationId: 1 });
leadSchema.index({ phone: 1, organizationId: 1 }, { unique: true });
leadSchema.index({ status: 1 });

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
