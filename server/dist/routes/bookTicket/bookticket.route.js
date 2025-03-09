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
import Event from '../../models/Event.js';
import Payment from '../../models/Payment.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import EventRegistrations from '../../models/EventRegistration.js';
const router = express.Router();
router.post('/:eventId', isAuthenticated('user&artist'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const event = yield Event.findById(eventId);
        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        // Find the selected ticket tier
        const ticketTier = event.ticketTiers.find(tier => { var _a; return ((_a = tier._id) === null || _a === void 0 ? void 0 : _a.toString()) === ticketTierId; });
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
        const payment = yield Payment.findOne({
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
        yield event.save();
        // Create ticket registration
        const registration = yield EventRegistrations.create({
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
    }
    catch (error) {
        console.error('Error booking ticket:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error booking ticket'
        });
    }
}));
export default router;
//# sourceMappingURL=bookticket.route.js.map