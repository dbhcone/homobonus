import mongoose, { Schema } from 'mongoose';
import { IEvent } from '../interfaces/event.interface';

const EventSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        capacity: { type: String },
        venue: { type: String, required: true },
        flyer: { type: Object, required: true },
        description: { type: String, required: true },
        extraDetails: { type: Array, default: null }
        // photos: [{type: String, default: null}]
    },
    { timestamps: true }
);

export default mongoose.model<IEvent>('event', EventSchema);
