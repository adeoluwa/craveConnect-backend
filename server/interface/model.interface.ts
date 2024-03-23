import { Schema, Document, HydratedDocument } from "mongoose";

export interface UserAttributes extends Document {
  _id: Schema.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  stateOfResidence: string;
  password: string;
  orders: HydratedDocument<FoodAttributes>["_id"][];
  reviews: HydratedDocument<UserReviewsAttributes>["_id"][];
  isBlocked: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodAttributes extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  recipes: string;
  price: number;
  avaliableFrom: Date;
  avaliableTo: Date;
  vendorId: HydratedDocument<VendorAttributes>["_id"];
  boughtBy: HydratedDocument<UserAttributes>["_id"][];
  reviews: HydratedDocument<UserAttributes>["_id"][];
  ratings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReviewsAttributes extends Document {
  _id: Schema.Types.ObjectId;
  user_id: HydratedDocument<UserAttributes>["_id"];
  food_id: HydratedDocument<FoodAttributes>["_id"];
  review: string;
  rating: number;
}

export interface VendorAttributes extends Document {
  _id: Schema.Types.ObjectId;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  stateOfResidence: string;
  password: string;
  location: string;
  isBlocked: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorReportAttributes extends Document {
  _id: Schema.Types.ObjectId;
  vendor_Id: HydratedDocument<VendorAttributes>["_id"];
  reported_user_Id: HydratedDocument<UserAttributes>["_id"];
  report_document?: string;
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReportAttributes extends Document {
  _id: Schema.Types.ObjectId;
  user_Id: HydratedDocument<UserAttributes>["_id"];
  reported_vendor_Id: HydratedDocument<VendorAttributes>["_id"];
  report_document?: string;
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAttributes extends Document {
  _id: Schema.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  stateOfResidence: string;
  suspended_User: HydratedDocument<UserAttributes>["_id"][];
  blocked_User: HydratedDocument<UserAttributes>["_id"][];
  suspended_Vendor: HydratedDocument<VendorAttributes>["_id"][];
  blocked_Vendor: HydratedDocument<VendorAttributes>["_id"][];
  createdAt: string;
  updatedAt: string;
};

export interface OrderAttributes extends Document {
  _id:Schema.Types.ObjectId;
  userId: HydratedDocument<UserAttributes>["_id"];
  foodItems:{
    foodId: HydratedDocument<FoodAttributes>["_id"];
    quantity: number
  }[];
  totalPrice: number;
  status:string;
  createdAt: string;
  updated:string;
}
