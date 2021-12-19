import { Request, Response } from 'express';
import { CResponse } from '../helpers/classes/response.class';
import { IInvoiceWithItems } from '../interfaces/billbox.interface';
import Users from '../models/user.model';
import Invoices from '../models/invoice.model';
const create = async (invoiceData: IInvoiceWithItems, userId: string) => {

  try {
    const findUser = await Users.findById(userId);

    if(!findUser) return {data: null, error: "User not found"};

    const data = {user: userId, invoiceItems: invoiceData};
    const invoice = await new Invoices(data).save();

    if (invoice) return {};
  } catch (error: any) {
    return {data: null}
  }
};



export { create };
