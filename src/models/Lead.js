import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    organizationId: { type: String, required: true },
    source: { type: String, default: "meta_ads" },
    adId: { type: String, default: null },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "converted", "closed"],
      default: "new",
    },
    assignedTo: {
      type: [String],
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

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
export default Lead;
