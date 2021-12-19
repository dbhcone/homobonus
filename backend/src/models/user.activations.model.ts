import mongoose, { Schema } from 'mongoose';

export interface IActivation extends Document{
    email: string;
    pin: string;
}

const ActivationSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IActivation>('Activations', ActivationSchema);
