import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import User from '../../../models/User.js';
import Artist from '../../../models/Artist.js';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, password, role } = req.body as { username?: string; password?: string; role?: string };
  try {
    if (!username || !password) {
      res.status(422).json({ error: 'Please fill all the required fields' });
      return;
    }
    let user;

    if (role === 'artist') {
      user = await Artist.findOne({ $or: [{ username }, { email: username }] });
    } else {
      user = await User.findOne({ $or: [{ username }, { email: username }] });
    }


    if (!user) {
      throw createError.Unauthorized('Invalid username or password');
    }

    if (user.password !== password) {
      throw createError.Unauthorized('Invalid username or password');
    }

    (req as any).userId = user._id;
    return next();
  } catch (error) {
    return next(error);
  }
};
