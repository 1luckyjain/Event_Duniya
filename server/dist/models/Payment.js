import mongoose, { Schema } from 'mongoose';
const PaymentSchema = new Schema({
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
const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
//# sourceMappingURL=Payment.js.map