import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { clearTokens, generateJWT } from '../../../utils/auth/auth.js';
import { Request, Response, NextFunction } from 'express';
import User from '../../../models/User.js';
import Artist from '../../../models/Artist.js';
import dotenv from 'dotenv';

dotenv.config();

interface DecodedToken {
  userId: number | string;
}

// Ensure environment variables are properly loaded
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Missing required environment variables');
}

const ACCESS_TOKEN_LIFE_SECONDS = Number(process.env.ACCESS_TOKEN_LIFE_SECOND);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken; // Use cookie-parser middleware

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as DecodedToken;
    const { userId } = decoded;

    let user = await User.findById(userId);
    if (!user) {
      user = await Artist.findById(userId);
    }

    // If user does not exist, clear tokens and return error
    if (!user) {
      await clearTokens(req, res);
      return next(createError.Unauthorized('User not found'));
    }

    // Generate a new access token
    const accessToken = generateJWT(user._id.toString(), ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE_SECONDS);

    // Send new access token
    res.status(200).json({
      user,
      accessToken,
      expiresAt: new Date(Date.now() + ACCESS_TOKEN_LIFE_SECONDS * 1000),
    });

  } catch (error) {
    // Clear tokens in case of invalid refresh token
    await clearTokens(req, res);
    return next(createError.Unauthorized('Invalid refresh token'));
  }
};
