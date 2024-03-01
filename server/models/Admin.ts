import mongoose from "mongoose";
import { AdminAttributes } from "../interface/model.interface";
import bcrypt from "bcryptjs";

export const AdminSchema = new mongoose.Schema<AdminAttributes>(
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
      unique: true,
      required: true,
    },
    phone: { type: String, required: true },
    password: {
      type: String,
      min: 8,
      max: 15,
    },
    stateOfResidence: {
      type: String,
      required: true,
    },
    location: { type: String },
    suspended_User: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blocked_User: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    suspended_Vendor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
    blocked_Vendor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AdminSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 10);

  return next();
});

export default mongoose.model<AdminAttributes>("Admin", AdminSchema);
