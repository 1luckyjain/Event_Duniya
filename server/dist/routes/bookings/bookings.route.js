var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import User from '../../models/User.js';
import Event from '../../models/Event.js';
import Payment from '../../models/Payment.js';
const router = express.Router();
// Get all bookings for a user
router.get('/:userId', isAuthenticated('user&artist'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Get all booked events with their complete details
        const bookedEvents = yield Event.find({
            _id: { $in: user.bookedEvents || [] }
        }).lean();
        // Get all payments for these events
        const payments = yield Payment.find({
            userId,
            eventId: { $in: user.bookedEvents || [] },
            status: 'paid'
        }).lean();
        // Create a map of eventId to payment for quick lookup
        const paymentMap = new Map(payments.map(payment => [payment.eventId.toString(), payment]));
        const bookings = bookedEvents.map(event => {
            const payment = paymentMap.get(event._id.toString());
            return {
                _id: (payment === null || payment === void 0 ? void 0 : payment._id.toString()) || `free-${event._id}`,
                event,
                user: {
                    username: user.username,
                    email: user.email
                },
                createdAt: (payment === null || payment === void 0 ? void 0 : payment.createdAt) || event.createdAt,
                status: payment ? 'PAID' : 'FREE'
            };
        });
        res.status(200).json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
}));
// Get specific ticket details
router.get('/ticket/:ticketId', isAuthenticated('user&artist'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ticketId } = req.params;
        let booking;
        if (ticketId.startsWith('free-')) {
            const eventId = ticketId.replace('free-', '');
            const event = yield Event.findById(eventId);
            if (!event) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }
            const user = yield User.findOne({ bookedEvents: eventId });
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
        }
        else {
            const payment = yield Payment.findById(ticketId)
                .populate('eventId')
                .lean();
            if (!payment) {
                res.status(404).json({ message: 'Ticket not found' });
                return;
            }
            const user = yield User.findById(payment.userId).lean();
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
    }
    catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Error fetching ticket details' });
    }
}));
export default router;
//# sourceMappingURL=bookings.route.js.map