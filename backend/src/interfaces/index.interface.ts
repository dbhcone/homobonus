import { Document } from 'mongoose';

export interface IContactUs extends Document {
    email: string;
    message: string;
    subject: string;
    fullName: string;
}
