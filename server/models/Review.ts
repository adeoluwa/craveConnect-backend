import mongoose from "mongoose";
import { UserReviewsAttributes } from "../interface/model.interface";
import Vendor from "./Vendor";
import User from "./User";
import Food from "./Food";

export const ReviewSchema = new mongoose.Schema<UserReviewsAttributes>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food"},
    comment: { type: String },
    rating: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<UserReviewsAttributes>("Review", ReviewSchema);


 