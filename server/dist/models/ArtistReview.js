import { Schema, model } from 'mongoose';
const ArtistReviewSchema = new Schema({
    artistId: { type: String, required: true },
    userId: { type: String, required: true },
    reviewDescription: { type: String, required: true },
    rating: { type: Number, required: true },
    uniqueId: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            return `${this.userId}${this.artistId}`;
        },
    },
}, { timestamps: true });
export default model('ArtistReview', ArtistReviewSchema);
//# sourceMappingURL=ArtistReview.js.map