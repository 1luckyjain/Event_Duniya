import { generateJWT } from '../utils/auth/auth.js';
import User from '../models/User.js';
import Artist from '../models/Artist.js';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_LIFE_SECOND = Number(process.env.ACCESS_TOKEN_LIFE_SECOND) || 15 * 60; 
const REFRESH_TOKEN_LIFE_SECOND = Number(process.env.REFRESH_TOKEN_LIFE_SECOND) || 7 * 24 * 60 * 60; 

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const NODE_ENV = process.env.NODE_ENV;
const dev = NODE_ENV === 'development';

interface AuthenticatedRequest extends Request {
  userId?: string | number;
}

export const generateAuthTokens = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let foundUser: any = await User.findById(req.userId);
    if (!foundUser) {
      foundUser = await Artist.findById(req.userId);
    }
    if (!foundUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const refreshToken = generateJWT(
      req.userId as string | number,
      REFRESH_TOKEN_SECRET as string,
      REFRESH_TOKEN_LIFE_SECOND
    );

    const accessToken = generateJWT(
      req.userId as string | number,
      ACCESS_TOKEN_SECRET as string,
      ACCESS_TOKEN_LIFE_SECOND
    );
    
    const refreshDuration = REFRESH_TOKEN_LIFE_SECOND * 1000; // in ms
    const accessDuration = ACCESS_TOKEN_LIFE_SECOND * 1000; // in ms

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + refreshDuration),
      secure: true,
      sameSite: "none",           
    });


    const expiresAt = new Date(Date.now() + accessDuration);

    res.status(200).json({
      user: foundUser,
      token: accessToken,
      expiresAt
    });
    return ; 
  } catch (error) {
    return next(error);
  }
};
