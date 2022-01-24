import mongoose, { Schema } from 'mongoose';
import { IMerchant } from '../interfaces/merchant.interface';

const MerchantSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        mobileNumber: { type: String, required: true },
        organisationName: { type: String, required: true },
        typeOfOrganisation: { type: String, required: true },
        address: { type: String },
        ghPostAddress: { type: String },
        status: { type: String, required: true, default: 'inactive' }
    },
    { timestamps: true }
);

export default mongoose.model<IMerchant>('Merchants', MerchantSchema);
