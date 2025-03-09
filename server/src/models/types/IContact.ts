export interface IContactForm extends Document {
  userId: string;
  artistId: string;
  name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  budget?: string;
  createdAt?: Date;
  updatedAt?: Date;
}