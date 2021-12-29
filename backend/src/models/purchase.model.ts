import mongoose, { Schema } from 'mongoose';
import { IPurchase } from '../interfaces/event.interface';

const PurchaseSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
        tickets: { type: Array },
        total: { type: Number },
        qrcode: { type: String },
        redeemed: { type: Boolean, default: false },
        dateOfRedemption: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.model<IPurchase>('purchase', PurchaseSchema);
