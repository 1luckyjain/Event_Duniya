// src/models/Artist.ts
import mongoose, { Schema } from 'mongoose';
const ArtistSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Artist' },
    avatars: { type: [String], default: [] },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    tag: { type: String, required: true },
    bio: { type: String, required: true },
    videoLink1: { type: String, required: true },
    videoLink2: { type: String },
    videoLink3: { type: String },
    instagram: { type: String, required: true },
    twitter: { type: String },
    youtube: { type: String },
    facebook: { type: String },
    tiktok: { type: String }
}, { timestamps: true });
const Artist = mongoose.model('Artist', ArtistSchema);
export default Artist;
//# sourceMappingURL=Artist.js.map