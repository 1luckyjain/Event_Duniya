var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Event from '../models/Event.js';
import dotenv from 'dotenv';
import { sendTicketMail } from '../utils/mail/sendTicketMail.js';
dotenv.config();
// Debug Razorpay configuration
console.log('Razorpay Config:', {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_exists: !!process.env.RAZORPAY_KEY_ID,
    secret_exists: !!process.env.RAZORPAY_KEY_SECRET
});
// Initialize Razorpay with timeout
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    headers: {
        "Content-Type": "application/json",
    },
});
// Promisify with timeout for Razorpay order creation
const createRazorpayOrder = (options) => {
    return new Promise((resolve, reject) => {
        // Increase timeout from 5s to 30s
        const timeout = setTimeout(() => {
            reject(new Error('Razorpay order creation timed out after 30 seconds'));
        }, 30000);
        try {
            razorpay.orders.create(options, (error, order) => {
                clearTimeout(timeout);
                if (error) {
                    console.error('Razorpay API error:', error);
                    reject(error);
                }
                else {
                    resolve(order);
                }
            });
        }
        catch (err) {
            clearTimeout(timeout);
            reject(err);
        }
    });
};
export const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, eventId, email, ticketTierId, quantity } = req.body;
        console.log('Creating order with inputs:', { userId, eventId, email, ticketTierId, quantity });
        // Validate inputs
        if (!userId || !eventId || !email || !ticketTierId || !quantity) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields',
                received: { userId, eventId, email, ticketTierId, quantity }
            });
            return;
        }
        console.log('Validating Razorpay credentials...');
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            res.status(500).json({
                success: false,
                message: 'Razorpay credentials are missing'
            });
            return;
        }
        console.log('Fetching event details...');
        const event = yield Event.findById(eventId);
        if (!event) {
            res.status(404).json({ success: false, message: 'Event not found' });
            return;
        }
        console.log('Finding selected ticket tier...');
        const selectedTier = event.ticketTiers.find(tier => tier._id.toString() === ticketTierId);
        if (!selectedTier) {
            res.status(404).json({
                success: false,
                message: 'Ticket tier not found',
                availableTiers: event.ticketTiers.map(t => t._id.toString())
            });
            return;
        }
        const amount = selectedTier.price * quantity;
        console.log(`Creating Razorpay order. Amount: ${amount}, Key: ${process.env.RAZORPAY_KEY_ID}`);
        // Create a simple order with minimal options
        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `receipt_${new Date().getTime()}`
        };
        console.log('Order options:', options);
        // Create order with error handling
        let order;
        try {
            console.log('Creating order with Razorpay...');
            order = yield createRazorpayOrder(options);
            console.log('Order created successfully:', order);
        }
        catch (orderError) {
            console.error('Razorpay order creation error:', orderError);
            // Try with a fake order for testing if in development mode
            if (process.env.NODE_ENV === 'development') {
                console.log('Using fake order for development...');
                order = {
                    id: 'order_' + Date.now(),
                    amount: amount * 100,
                    currency: 'INR',
                    status: 'created',
                    receipt: `receipt_${new Date().getTime()}`
                };
            }
            else {
                throw new Error(`Failed to create Razorpay order: ${orderError.message}`);
            }
        }
        console.log('Saving payment to database...');
        // Save payment in database
        const payment = new Payment({
            razorpay_order_id: order.id,
            userId,
            eventId,
            ticketTierId,
            quantity,
            amount,
            status: 'created',
            email
        });
        yield payment.save();
        console.log('Sending response...');
        // Send response with explicit fields
        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency || 'INR'
            },
            key_id: process.env.RAZORPAY_KEY_ID,
            amount
        });
    }
    catch (error) {
        console.error('Payment order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating payment order'
        });
    }
});
export const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        // Verify the payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        const isSignatureValid = generatedSignature === razorpay_signature;
        // Update payment status in database
        const payment = yield Payment.findOne({ razorpay_order_id });
        if (!payment) {
            res.status(404).json({ success: false, message: 'Payment not found' });
            return;
        }
        payment.razorpay_payment_id = razorpay_payment_id;
        payment.razorpay_signature = razorpay_signature;
        payment.status = isSignatureValid ? 'paid' : 'failed';
        yield payment.save();
        if (isSignatureValid) {
            try {
                // Fetch populated data to get user & event info
                const fullPayment = yield Payment.findOne({ razorpay_order_id })
                    .populate('userId')
                    .populate('eventId');
                // If references found, send the email
                if ((fullPayment === null || fullPayment === void 0 ? void 0 : fullPayment.userId) && (fullPayment === null || fullPayment === void 0 ? void 0 : fullPayment.eventId)) {
                    const tierDoc = fullPayment.eventId.ticketTiers
                        .find((t) => t._id.toString() === fullPayment.ticketTierId);
                    const tierName = tierDoc ? tierDoc.name : 'N/A';
                    yield sendTicketMail(fullPayment.userId, fullPayment.eventId, fullPayment._id.toString(), fullPayment.createdAt, tierName);
                }
            }
            catch (mailError) {
                // Mail failure should not abort the process
                console.error('Ticket mail error:', mailError);
            }
            res.status(200).json({
                success: true,
                message: 'Payment has been verified',
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Error verifying payment' });
    }
});
export const getPaymentsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const payments = yield Payment.find({ userId }).populate('eventId');
        res.status(200).json({ success: true, payments });
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, message: 'Error fetching payments' });
    }
});
//# sourceMappingURL=payment.controller.js.map