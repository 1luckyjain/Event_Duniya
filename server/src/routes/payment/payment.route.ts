import express, { Request, Response } from 'express';
import { createOrder, verifyPayment, getPaymentsByUser } from '../../controllers/payment.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const router = express.Router();

// Simple test route to verify the router is working
router.get('/test', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Payment routes are working!' });
});

// Payment routes
router.post('/create-order', isAuthenticated('user&artist'), (req: Request, res: Response) => createOrder(req, res));
router.post('/verify-payment', isAuthenticated('user&artist'), (req: Request, res: Response) => verifyPayment(req, res));
router.get('/user/:userId', isAuthenticated('user&artist'), (req: Request, res: Response) => getPaymentsByUser(req, res));

export default router;
