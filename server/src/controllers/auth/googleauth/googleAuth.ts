import { OAuth2Client } from 'google-auth-library';
import createError from 'http-errors';
import User from '../../../models/User.js';

const client = new OAuth2Client(process.env.GOOGLE_AUTH);

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return next(createError(400, "Missing Google credential"));
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
  
    const {  email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name,
        email,
        password: "nopassword",
        role: "User",
        avatar: picture,
      });
    }

    (req as any).userId = user._id;

   next();
  } catch (error) {
    next(error);
  }
};


