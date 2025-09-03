import mongoose, { Schema, Document, Types } from "mongoose";

export interface INote extends Document {
  userId: Types.ObjectId;   // ✅ ObjectId type
  content: string;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", noteSchema);
