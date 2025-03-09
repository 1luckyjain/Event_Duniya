// // src/middleware/authMiddleware.ts
// import { Request, Response, NextFunction } from 'express';
// import { TokenPayload, verifyRefreshToken, verifyAccessToken, generateAccessToken, generateRefreshToken } from '../services/tokenservice/tokenService';
// export interface AuthenticatedRequest extends Request {
//   user?: TokenPayload['user'];
// }
// export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   // Retrieve tokens from HTTP‑only cookies
//   const accessToken = req.cookies?.accessToken;
//   const refreshToken = req.cookies?.refreshToken;
//   // If no refresh token is provided, authentication fails.
//   if (!refreshToken) {
//     return res.status(401).json({ message: 'Unauthorized: Refresh token not provided.' });
//   }
//   let user: TokenPayload['user'];
//   // Verify refresh token first.
//   try {
//     const decodedRefresh = verifyRefreshToken(refreshToken);
//     user = decodedRefresh.user;
//   } catch (error) {
//     console.error('Invalid or expired refresh token:', error);
//     return res.status(401).json({ message: 'Unauthorized: Invalid refresh token.' });
//   }
//   // Attempt to verify the access token.
//   try {
//     if (accessToken) {
//       verifyAccessToken(accessToken); // Will throw if invalid or expired.
//       req.user = user;
//       return next();
//     }
//   } catch (error) {
//     console.warn('Access token expired or invalid:', error);
//     // Fall through to generate new tokens.
//   }
//   // At this point, either the access token is missing or invalid.
//   // Generate new tokens using the user data from the refresh token.
//   const newAccessToken = generateAccessToken(user);
//   const newRefreshToken = generateRefreshToken(user);
//   // Set the new tokens as HTTP‑only cookies.
//   res.cookie('accessToken', newAccessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production.
//     sameSite: 'strict',
//     maxAge: 15 * 60 * 1000, // 15 minutes
//   });
//   res.cookie('refreshToken', newRefreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });
//   // Attach the user to the request object for further handlers.
//   req.user = user;
//   return next();
// };
