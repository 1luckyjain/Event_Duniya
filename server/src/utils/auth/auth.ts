import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const dev = process.env.NODE_ENV === 'development';

export const generateJWT = (userId: string | number, secret: string, expirationTime: number): string => {
  return jwt.sign({ userId }, secret, {expiresIn: expirationTime });
};

export const clearTokens = async (req: Request, res: Response): Promise<void> => {
  // Clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    signed: true,
  });

  // Clear any other cookies if they exist
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // Clear the session if it exists
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
  }
};
