import { Document, Types } from 'mongoose';

export interface TicketTier {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  maxQuantity: number;
  availableQuantity: number;
}

export interface IEvent extends Document {
  image: string;
  image1?: string;
  image2?: string;
  title: string;
  date: Date;
  location: string;
  city: string;
  time: string;
  description: string;
  type: string;
  genere: string;
  capacity: number;
  ticketTiers: TicketTier[];
  createdAt: Date;
  updatedAt: Date;
}