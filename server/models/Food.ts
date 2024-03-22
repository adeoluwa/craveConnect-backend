import mongoose from "mongoose";
import { FoodAttributes } from "../interface/model.interface";
import Vendor from "./Vendor";
import User from "./User";
import Review from "./Review";

export const FoodSchema = new mongoose.Schema<FoodAttributes>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    recipes: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    avaliableFrom: {
      type: Date,
    },
    avaliableTo: {
      type: Date,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Vendor,
    },
    boughtBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Review,
      },
    ],

    ratings: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<FoodAttributes>("Food", FoodSchema);
