import mongoose from "mongoose";

const documentationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    projectTitle: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    data: {
      type: String, // Base64 encoded data
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Documentation =
  mongoose.models.Documentation ||
  mongoose.model("Documentation", documentationSchema);

export default Documentation;
