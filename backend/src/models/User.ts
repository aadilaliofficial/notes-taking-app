import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string; // optional (Google auth users may not have password)
  name?: string;
  googleId?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);