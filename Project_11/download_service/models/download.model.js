import mongoose from "mongoose";

const downloadSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    downloaded: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Downloads = mongoose.model("Downloads", downloadSchema);
