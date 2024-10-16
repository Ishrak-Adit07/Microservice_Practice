import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    payment: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);