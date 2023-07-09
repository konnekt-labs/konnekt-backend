import mongoose, { ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId | String;
  username: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
  friendCount: number;
  friends: ObjectId[] | String[];
}

const userSchema = new mongoose.Schema<IUser>({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date,
  isDeleted: { type: Boolean, default: false },
  friendCount: { type: Number, default: 0 },
  friends: [{ type: mongoose.Types.ObjectId }],
});

export const User = mongoose.model("User", userSchema);
