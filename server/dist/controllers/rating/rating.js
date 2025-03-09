var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Rating from '../../models/Rating.js';
const updateRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artistId, rating } = req.body;
        if (!artistId || rating === undefined) {
            res.status(400).json({ message: 'Artist ID and rating are required' });
            return;
        }
        let existingRating = yield Rating.findOne({ artistId });
        if (!existingRating) {
            existingRating = new Rating({ artistId, ratingCount: 1, rating });
        }
        else {
            existingRating.rating =
                (existingRating.rating * existingRating.ratingCount + rating) /
                    (existingRating.ratingCount + 1);
            existingRating.ratingCount += 1;
        }
        yield existingRating.save();
        res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
});
export default updateRating;
