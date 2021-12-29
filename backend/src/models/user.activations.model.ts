import mongoose, { Schema } from 'mongoose';

export interface IActivation extends Document {
    email: string;
    pin: string;
    mobileNumber: string;
}

const ActivationSchema: Schema = new Schema(
    {
        email: { type: String, unique: true },
        pin: { type: String, required: true },
        mobileNumber: { type: String, unique: true }
    },
    { timestamps: true }
);

export default mongoose.model<IActivation>('Activations', ActivationSchema);
