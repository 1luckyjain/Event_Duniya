import mongoose, { Schema, Document } from "mongoose";

export interface IEventRegistrations extends Document {
  eventId: string;
  userId: string;
  ticketTierId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistrations>(
  {
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    ticketTierId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

const EventRegistrations = mongoose.model<IEventRegistrations>("Ticket", EventRegistrationSchema);

export default EventRegistrations;
