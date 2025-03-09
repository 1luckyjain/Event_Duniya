// src/models/interfaces/IArtist.ts
import { IUser } from './IUser.js';

export interface IArtist extends IUser {
  avatars: string[]; // URLs for images (e.g., from S3)
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  tag: string;
  bio: string;
  videoLink1: string;
  videoLink2?: string;
  videoLink3?: string;
  instagram: string;
  twitter: string;
  youtube: string;
  facebook: string;
  tiktok: string;
}
