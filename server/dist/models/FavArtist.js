// models/SavedArtist.ts
import { Schema, model } from "mongoose";
export const SavedArtistSchema = new Schema({
    userId: { type: String, required: true },
    artistId: { type: String, required: true },
}, { timestamps: true });
// Ensure that each (userId, artistId) pair is unique
SavedArtistSchema.index({ userId: 1, artistId: 1 }, { unique: true });
export default model("SavedArtist", SavedArtistSchema);
