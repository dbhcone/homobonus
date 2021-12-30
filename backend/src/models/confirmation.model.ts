import mongoose, { Schema } from 'mongoose';
import { IConfirmation } from '../interfaces/event.interface';

const ConfirmationSchema: Schema = new Schema(
    {
        name: { type: String, unique: true },
        mobileNumber: { type: String, unique: true }
    },
    { timestamps: true }
);

export default mongoose.model<IConfirmation>('confirmation', ConfirmationSchema);
