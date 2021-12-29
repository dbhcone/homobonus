import mongoose, { Schema } from 'mongoose';
import { IRedemption } from '../interfaces/event.interface';

const RedemptionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
        purchaseId: { type: String, required: true, ref: 'purchases' },
        redemptionCode: { type: String, required: true },
        redeemed: { type: Boolean, default: false },
        dateRedeemed: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.model<IRedemption>('redemption', RedemptionSchema);
