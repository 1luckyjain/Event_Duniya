import express, { Request, Response } from 'express';
import User from '../../models/User.js';
import Event from '../../models/Event.js';
import Payment from '../../models/Payment.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { validateFields } from '../../middlewares/validation.js';
import { bookTicketFields } from '../../utils/validators/validator.js';
import mongoose from 'mongoose';
import { IUser } from '../../models/types/IUser.js';
import EventRegistrations from '../../models/EventRegistration.js';

const router = express.Router();

router.post('/:eventId', isAuthenticated('user&artist'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { userId, ticketTierId, quantity } = req.body;

    if (!userId || !eventId || !ticketTierId || !quantity) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Find the selected ticket tier
    const ticketTier = event.ticketTiers.find(
      tier => tier._id?.toString() === ticketTierId
    );

    if (!ticketTier) {
      res.status(404).json({ success: false, message: 'Ticket tier not found' });
      return;
    }

    // Check if enough tickets are available
    if (ticketTier.availableQuantity < quantity) {
      res.status(400).json({ 
        success: false, 
        message: 'Not enough tickets available' 
      });
      return;
    }

    // Check payment status
    const payment = await Payment.findOne({
      userId,
      eventId,
      ticketTierId,
      status: 'paid'
    }).sort({ createdAt: -1 });

    if (!payment) {
      res.status(400).json({ success: false, message: 'Payment required' });
      return;
    }

    // Update ticket availability
    ticketTier.availableQuantity -= quantity;
    await event.save();

    // Create ticket registration
    const registration = await EventRegistrations.create({
      eventId,
      userId,
      ticketTierId,
      quantity
    });

    res.status(200).json({ 
      success: true, 
      message: 'Ticket booked successfully',
      bookingId: registration._id
    });
  } catch (error) {
    console.error('Error booking ticket:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error booking ticket'
    });
  }
});

export default router;
