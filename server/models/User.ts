import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserAttributes } from "../interface/model.interface";

export const UserSchema = new mongoose.Schema<UserAttributes>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    stateOfResidence: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    password: {
      type: String,
      min: 8,
      max: 15,
      required: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 10);

  return next();
});

export default mongoose.model<UserAttributes>("User", UserSchema);
