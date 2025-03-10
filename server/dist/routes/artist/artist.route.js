var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { GenericController } from '../../controllers/genericController.js';
import Artist from '../../models/Artist.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import jwt from 'jsonwebtoken';
const artistController = new GenericController(Artist);
const router = Router();
router.get('/list', artistController.getAll);
router.get('/:id', isAuthenticated('user&artist'), artistController.get);
router.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, avatars, city, state, country, pincode, phoneNumber, tag, bio, videoLink1, videoLink2, videoLink3, instagram, twitter, youtube, facebook, tiktok } = req.body;
        // Check if required fields are present
        if (!username || !email || !password || !city || !state || !country ||
            !pincode || !phoneNumber || !tag || !bio || !videoLink1 || !instagram) {
            res.status(422).json({ message: 'Missing required fields' });
            return;
        }
        // Check if user already exists
        const existingArtist = yield Artist.findOne({ email });
        if (existingArtist) {
            res.status(409).json({ message: 'Artist with this email already exists' });
            return;
        }
        // Create artist with plain password (no hashing)
        const newArtist = new Artist({
            username,
            email,
            password,
            role: 'artist',
            avatars: avatars || [],
            city,
            state,
            country,
            pincode,
            phoneNumber,
            tag,
            bio,
            videoLink1,
            videoLink2,
            videoLink3,
            instagram,
            twitter,
            youtube,
            facebook,
            tiktok
        });
        const savedArtist = yield newArtist.save();
        // Generate JWT token
        const token = jwt.sign({ id: savedArtist._id, role: 'artist' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        // Return response without password
        const artistWithoutPassword = Object.assign({}, savedArtist.toObject());
        delete artistWithoutPassword.password;
        res.status(201).json({
            message: 'Artist registered successfully',
            user: artistWithoutPassword,
            token,
            expiresAt
        });
    }
    catch (error) {
        console.error('Artist signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}));
export default router;
//# sourceMappingURL=artist.route.js.map