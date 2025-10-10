import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    adId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "converted", "closed"],
      default: "new",
      index: true,
    },
    assignedTo: [
      {
        type: String,
      },
    ],
    metadata: {
      type: Object,
      default: {},
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

leadSchema.index({ organizationId: 1 });
leadSchema.index(
  { contactId: 1, organizationId: 1 },
  { unique: true, sparse: true }
);
leadSchema.index({ status: 1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
export default Lead;
