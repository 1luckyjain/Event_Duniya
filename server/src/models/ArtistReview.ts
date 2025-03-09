import { Schema, model, Document } from 'mongoose';

interface IArtistReview extends Document {
  userId: string;
  artistId: string;
  reviewDescription: string;
  rating: number;
  uniqueId: string;
}

const ArtistReviewSchema = new Schema<IArtistReview>(
  {
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
  },
  { timestamps: true }
);

export default model<IArtistReview>('ArtistReview', ArtistReviewSchema);
