import { Document } from 'mongoose';

export type UserRole = 'User' | 'Admin' | 'Artist';

export interface IUserDoc {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  bookedEvents?: string[];
}

export interface IUser extends Document, IUserDoc {}
