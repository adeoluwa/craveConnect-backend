import mongoose from "mongoose";
import { VendorAttributes } from "../interface/model.interface";
import bcrypt from "bcryptjs"

export const VendorSchema = new mongoose.Schema<VendorAttributes>({
  firstname: {
    type: String,
    required: true,
  },
  lastname:{
    type:String,
    required:true
  },
  username:{
    type:String,
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  phone:{
    type:String
  },
  stateOfResidence:{
    type:String,
    required:true,
  },
  location:{
    type:String,
    required:true
  },
  password:{
    type:String,
    min:8,
    max:15,
    required:true
  },
  isSuspended:{
    type:Boolean,
    default:false,
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
},
{
  timestamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});


VendorSchema.pre("save", function(next){
  if (!this.isModified("password")) return next()

  this.password = bcrypt.hashSync(this.password, 10);

  return next();
});

export default mongoose.model<VendorAttributes>("Vendor", VendorSchema)