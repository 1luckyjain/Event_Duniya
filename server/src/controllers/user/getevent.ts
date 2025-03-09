import { Request, Response, NextFunction } from 'express';
import EventRegistrations from '../../models/EventRegistration.js';

// Extend Request to include userId (if not already defined)
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// GET /api/eventregistrations/my
export const getUserEventIds = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Ensure userId exists on the request (set by your authentication middleware)
    const userId = req.body.userId;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Find all event registrations for this user
    const registrations = await EventRegistrations.find({ userId });
    // Extract the eventIds from the registrations
    const eventIds = registrations.map((registration) => registration.eventId);

    res.status(200).json({ eventIds });
  } catch (error) {
    next(error);
  }
};
