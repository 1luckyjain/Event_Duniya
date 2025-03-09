import mongoose, { Schema } from "mongoose";
const EventRegistrationSchema = new Schema({
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    ticketTierId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { timestamps: true });
const EventRegistrations = mongoose.model("Ticket", EventRegistrationSchema);
export default EventRegistrations;
//# sourceMappingURL=EventRegistration.js.map