import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import User from '../../models/User.js';
import Event from '../../models/Event.js';
import Payment from '../../models/Payment.js';
import { IEvent } from '../../models/types/IEvent.js';
import { IUser } from '../../models/types/IUser.js';
import { IPayment } from '../../models/Payment.js';

interface BookingResponse {
  _id: string;
  event: IEvent;
  user: {
    username: string;
    email: string;
  };
  createdAt: Date;
  status: 'PAID' | 'FREE';
}

interface PopulatedPayment extends Omit<IPayment, 'eventId'> {
  eventId: IEvent;
}

const router = express.Router();

// Get all bookings for a user
router.get('/:userId', isAuthenticated('user&artist'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId) as IUser | null;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get all booked events with their complete details
    const bookedEvents = await Event.find({
      _id: { $in: user.bookedEvents || [] }
    }).lean() as IEvent[];

    // Get all payments for these events
    const payments = await Payment.find({
      userId,
      eventId: { $in: user.bookedEvents || [] },
      status: 'paid'
    }).lean();

    // Create a map of eventId to payment for quick lookup
    const paymentMap = new Map(
      payments.map(payment => [payment.eventId.toString(), payment])
    );

    const bookings: BookingResponse[] = bookedEvents.map(event => {
      const payment = paymentMap.get(event._id.toString());
      
      return {
        _id: payment?._id.toString() || `free-${event._id}`,
        event,
        user: {
          username: user.username,
          email: user.email
        },
        createdAt: payment?.createdAt || event.createdAt,
        status: payment ? 'PAID' : 'FREE'
      };
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get specific ticket details
router.get('/ticket/:ticketId', isAuthenticated('user&artist'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    let booking: BookingResponse;

    if (ticketId.startsWith('free-')) {
      const eventId = ticketId.replace('free-', '');
      const event = await Event.findById(eventId) as IEvent | null;
      if (!event) {
        res.status(404).json({ message: 'Ticket not found' });
        return;
      }
      
      const user = await User.findOne({ bookedEvents: eventId }) as IUser | null;
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      booking = {
        _id: ticketId,
        event,
        user: {
          username: user.username,
          email: user.email
        },
        createdAt: event.createdAt,
        status: 'FREE'
      };
    } else {
      const payment = await Payment.findById(ticketId)
        .populate<{ eventId: IEvent }>('eventId')
        .lean() as PopulatedPayment | null;

      if (!payment) {
        res.status(404).json({ message: 'Ticket not found' });
        return;
      }
      
      const user = await User.findById(payment.userId).lean() as IUser | null;
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      booking = {
        _id: payment._id.toString(),
        event: payment.eventId,
        user: {
          username: user.username,
          email: user.email
        },
        createdAt: new Date(payment.createdAt),
        status: 'PAID'
      };
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Error fetching ticket details' });
  }
});

export default router;
