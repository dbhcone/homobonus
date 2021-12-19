import mongoose, { Schema } from 'mongoose';
import { IContactUs } from '../interfaces/index.interface';

const ContactUsSchema: Schema = new Schema({
  email: { type: String, required: true },
  fullName: { type: String, required: true},
  message: { type: String, required: true },
  subject: { type: String, default: null },
}, {timestamps: true});

export default mongoose.model<IContactUs>('Enquiries', ContactUsSchema);
