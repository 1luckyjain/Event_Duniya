import { Document, Schema, model } from "mongoose";
import { IContactForm } from "./types/IContact";

const ContactFormSchema = new Schema<IContactForm>(
  {
    userId: { type: String, required: true },
    artistId: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    budget: { type: String },
  },
  { timestamps: true }
);

const ContactForm = model<IContactForm>("ContactForm", ContactFormSchema);
export default ContactForm;
