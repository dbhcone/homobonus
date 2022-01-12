import mongoose, { Schema } from 'mongoose';
import { IAccount } from '../interfaces/account.interface';

const AccountSchema: Schema = new Schema(
    {
        surname: { type: String, required: true },
        firstName: { type: String, required: true },
        otherNames: { type: String },
        gender: { type: String, required: true },
        primaryMobileNumber: { type: String, required: true, unique: true },
        otherNumbers: [{ type: String }],
        occupation: { type: String },
        company: { type: String },
        dateOfBirth: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.model<IAccount>('Accounts', AccountSchema);
