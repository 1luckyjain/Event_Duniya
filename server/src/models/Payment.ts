import mongoose, { Schema, Document, Model } from 'mongoose';
import { IEvent } from './types/IEvent.js';

export interface IPayment extends Document {
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId | IEvent;
  ticketTierId: string;
  quantity: number;
  amount: number;
  status: 'created' | 'paid' | 'failed';
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketTierId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  email: { type: String, required: true }
}, {
  timestamps: true
});

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
