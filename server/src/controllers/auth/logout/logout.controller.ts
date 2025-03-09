import { Request, Response } from 'express';
import { clearTokens } from '../../../utils/auth/auth.js';

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use the utility function to clear tokens
    await clearTokens(req, res);
    
    // Also try clearing without options for older browsers
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    
    // Clear any potential additional cookies used for auth
    res.clearCookie('connect.sid'); // Express session cookie
    
    // Respond with 200 and a success message
    res.status(200).json({ message: 'Logged out successfully', success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Ensure we always send a successful response
    res.status(200).json({ message: 'Logged out on client', success: true });
  }
};
