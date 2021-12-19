import { Document } from "mongoose";
import { IInvoiceWithItems } from "./billbox.interface";
import { IUser } from "./user.interface";

export interface IInvoice extends Document {
  user: IUser['_id'];
  invoiceItems: IInvoiceWithItems;
}
