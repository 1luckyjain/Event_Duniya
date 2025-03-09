import { Request, Response, NextFunction } from 'express';
import User from '../../../models/User.js';
import Artist from '../../../models/Artist.js';
import { IUser } from '../../../models/types/IUser.js';
import { IArtist } from '../../../models/types/IArtist.js';
import { validateFields, artistRequiredFields, userRequiredFields } from '../../../utils/validators/validator.js';

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;
    if (role && role === 'artist') {
      const missingArtist = validateFields(req.body, artistRequiredFields);
      if (missingArtist) {
        res.status(422).json({ error: `Please fill the required artist field: ${missingArtist}` });
        return;
      }
    
      const {
        username,
        email,
        password,
        avatars,
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
      } = req.body as IArtist;
 
      const artistAlreadyExists = await Artist.findOne({ $or: [{ username }, { email }] });
      if (artistAlreadyExists) {
        res.status(422).json({ error: 'Username or email already exists' });
        return;
      }
      const newArtist = await Artist.create({
        username,
        email,
        password,
        role: 'Artist',
        avatars,
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
   
      (req as any).userId = newArtist._id;
    } else {

      const missingUser = validateFields(req.body, userRequiredFields);
      if (missingUser) {
        res.status(422).json({ error: `Please fill the required field: ${missingUser}` });
        return;
      }
      const { username, email, password } = req.body as IUser;
      const userAlreadyExists = await User.findOne({ $or: [{ username }, { email }] });
      if (userAlreadyExists) {
        res.status(422).json({ error: 'Username or email already exists' });
        return;
      }
      const newUser = await User.create({
        username,
        email,
        password,
        role: 'User'
      });
      (req as any).userId = newUser._id;
    }
    next();
  } catch (error) {
    next(error);
  }
};
