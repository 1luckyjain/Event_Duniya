import mongoose, { Schema } from 'mongoose';
const TicketTierSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    maxQuantity: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
}, { _id: true });
const EventSchema = new Schema({
    image: { type: String, required: true },
    image1: { type: String },
    image2: { type: String },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    capacity: { type: Number, required: true },
    genere: { type: String, required: true },
    ticketTiers: { type: [TicketTierSchema], required: true, default: [] }
}, {
    timestamps: true,
    versionKey: false
});
const Event = mongoose.model('Event', EventSchema);
export default Event;
//# sourceMappingURL=Event.js.map