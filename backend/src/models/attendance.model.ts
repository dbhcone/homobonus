import mongoose, { Schema } from 'mongoose';
import { IAttendance } from '../interfaces/event.interface';

const AttendanceSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
        event: { type: Schema.Types.ObjectId, required: true, ref: 'events' }
    },
    { timestamps: true }
);

export default mongoose.model<IAttendance>('attendance', AttendanceSchema);
