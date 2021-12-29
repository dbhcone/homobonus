import mongoose, { Schema } from 'mongoose';
import { IInvoice } from '../interfaces/invoice.interface';

const InvoiceSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, required: true },
        invoiceItems: { type: Schema.Types.Array, required: true }
    },
    { timestamps: true }
);

export default mongoose.model<IInvoice>('invoice', InvoiceSchema);
