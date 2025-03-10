import { Router, Request, Response, NextFunction } from 'express';
import { GenericController } from '../../controllers/genericController.js';
import Artist from '../../models/Artist.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import jwt from 'jsonwebtoken';

const artistController = new GenericController(Artist);
const router: Router = Router();

router.get('/list', artistController.getAll);
router.get('/:id', isAuthenticated('user&artist'), artistController.get);

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      username, email, password, avatars, 
      city, state, country, pincode, phoneNumber, tag, bio,
      videoLink1, videoLink2, videoLink3, instagram, twitter, youtube, facebook, tiktok
    } = req.body;
    
    // Check if required fields are present
    if (!username || !email || !password || !city || !state || !country || 
        !pincode || !phoneNumber || !tag || !bio || !videoLink1 || !instagram) {
      res.status(422).json({ message: 'Missing required fields' });
      return;
    }
    
    // Check if user already exists
    const existingArtist = await Artist.findOne({ email });
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
    
    const savedArtist = await newArtist.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: savedArtist._id, role: 'artist' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Return response without password
    const artistWithoutPassword = { ...savedArtist.toObject() };
    delete artistWithoutPassword.password;
    
    res.status(201).json({
      message: 'Artist registered successfully',
      user: artistWithoutPassword,
      token,
      expiresAt
    });
  } catch (error: any) {
    console.error('Artist signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;