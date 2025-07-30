import mongoose, { Document, models, Model, Schema } from "mongoose";

export interface INote extends Document {
  _id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide content for the note."],
      maxlength: [2000, "Content cannot be more than 2000 characters"],
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note: Model<INote> = models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;