import mongoose, { Schema } from 'mongoose';
import { IMerchant } from '../interfaces/merchant.interface';

const MerchantSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    organisationName: { type: String, required: true },
    status: { type: String, required: true, default: 'inactive' },
});

export default mongoose.model<IMerchant>('Merchants', MerchantSchema);
