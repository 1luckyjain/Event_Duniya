import { Schema, model } from 'mongoose';
const RatingSchema = new Schema({
    ratingCount: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true }
}, { timestamps: true });
export default model('Rating', RatingSchema);
