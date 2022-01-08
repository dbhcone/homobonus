import mongoose, { Schema } from 'mongoose';
import { IPasswordReset } from '../interfaces/user.interface';

const PasswordReset: Schema = new Schema(
    {
        email: { type: String, required: true },
        pin: { type: String, required: true },
        token: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IPasswordReset>('passwordreset', PasswordReset);
