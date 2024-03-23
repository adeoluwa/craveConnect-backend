import mongoose from "mongoose";
import { OrderAttributes } from "../interface/model.interface";
import User from "./User";
import Food from "./Food";

export const OrderSchema = new mongoose.Schema<OrderAttributes>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    foodItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Food,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<OrderAttributes>("Order", OrderSchema);
