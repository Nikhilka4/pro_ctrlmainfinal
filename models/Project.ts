import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    projectTitle: {
      type: String,
      required: true,
      unique: true,
    },
    projectStatus: {
      type: String,
      enum: [
        "Quoted",
        "Design",
        "Fabrication",
        "Transportation",
        "Assembly",
        "Bolting",
        "Erection",
        "Finishing Touches",
      ],
      required: true,
    },
    highPriority: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    estimatedEndDate: {
      type: Date,
    },
    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },
    type: {
      type: String,
      enum: ["PEB Construction", "Conventional Construction"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    documentStatus: {
      type: String,
      enum: [
        "Quotation",
        "Agreement letter",
        "Order confirmation",
        "Advance payment receipt",
        "Payment Due letter",
        "Final invoice",
      ],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Active", "Non Active"],
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      default: 0,
    },
    paid: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
