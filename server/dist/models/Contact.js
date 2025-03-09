import { Schema, model } from "mongoose";
const ContactFormSchema = new Schema({
    userId: { type: String, required: true },
    artistId: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    budget: { type: String },
}, { timestamps: true });
const ContactForm = model("ContactForm", ContactFormSchema);
export default ContactForm;
//# sourceMappingURL=Contact.js.map