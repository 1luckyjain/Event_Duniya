import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Artist from '../models/Artist.js';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

interface AuthenticatedRequest extends Request {
  userId?: string | number;
  signedCookies: { [key: string]: string };
}

export const isAuthenticated = (roles: string) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authToken = req.get('Authorization');
      const accessToken = authToken?.split('Bearer ')[1];
     
      if (!accessToken) {
        next(createError.Unauthorized());
        return;
      }
     
      const cookies = req.headers.cookie?.split('; ');

      if (!cookies?.length) {
        return;
      }
      
      const refreshTokenCookie = cookies.find((cookie) =>
        cookie.startsWith(`refreshToken=`)
      );
      if (!refreshTokenCookie) {
        return;
      }
      
      const refreshToken = refreshTokenCookie.split('=')[1];
    
      if (!refreshToken) {
        res.sendStatus(204);
        return;
      }

      if (!refreshToken) {
        next(createError.Unauthorized());
        return;
      }
   
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string);
      } catch (err) {
        console.log("Token verification failed.");
        next(createError.Unauthorized());
        return;
      }
      
      const { userId } = decodedToken;
      
      // Log the userId from the token to help with debugging
      console.log(`Token contains userId: ${userId}`);
 
      let foundUser: any;
      if (roles === 'artist' || roles === 'user&artist') {
        foundUser = await Artist.findById(userId);
      } 
      if(!foundUser && (roles === 'user' || roles === 'user&artist')) {
        foundUser = await User.findById(userId);
      }
   
      if (!foundUser) {
        next(createError.Unauthorized());
        return;
      }
      
      // Make sure userId is stored as a string to avoid comparison issues
      req.userId = foundUser._id.toString();
      console.log(`Setting req.userId to: ${req.userId}`);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
};
