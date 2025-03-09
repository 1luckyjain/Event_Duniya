// models/SavedArtist.ts
import { Schema, model, Document } from "mongoose";

export interface ISavedArtist extends Document {
  userId: string;
  artistId: string;
}

export const SavedArtistSchema = new Schema<ISavedArtist>(
  {
    userId: { type: String, required: true },
    artistId: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure that each (userId, artistId) pair is unique
SavedArtistSchema.index({ userId: 1, artistId: 1 }, { unique: true });

export default model<ISavedArtist>("SavedArtist", SavedArtistSchema);
