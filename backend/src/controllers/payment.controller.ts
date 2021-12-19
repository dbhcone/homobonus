import { Request, Response } from 'express';
import { CResponse } from '../helpers/classes/response.class';
import { mongooseId } from '../helpers/functions/shared.helpers';
import { IInvoiceWithItems, IPayNow } from '../interfaces/billbox.interface';
import {
    cancelInvoice,
    checkPaymentStatus,
    createInvoiceWithoutItems,
    createInvoiceWithItems,
    getInvoice,
    getInvoiceSummary,
    listPaymentOptions,
    payNow,
} from '../libs/billbox';

const paymentOptions = async (req: Request, res: Response) => {
    try {
        const requestId = mongooseId();

        let response = await listPaymentOptions(requestId);
        const { status: code, statusText: message, data } = response;
        return CResponse.success(res, { code, message, data });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const createInvoice = async (invoiceData: IInvoiceWithItems) => {
    try {
        const requestId = mongooseId();
        let resp = await createInvoiceWithItems(requestId, invoiceData);

        return { data: resp.data };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

// const makePayment = async (req: Request, res: Response) => {
//     try {
//         const requestId = mongooseId();

//         let response = await payNow(requestId, )
//     } catch (error: any) {

//     }
// }

const beginPayment = async (paynow: IPayNow) => {
    try {
        const requestId = mongooseId();
        let payment = await payNow(requestId, paynow);
        if (payment.data.success) {
            // check payment status after 30 seconds
            let firstCheck = setTimeout(() => {}, 30000);
        }
    } catch (error: any) {}
};

const paymentStatus = async (transactionId: string) => {
    try {
        const requestId = mongooseId();

        let stat = await checkPaymentStatus(requestId, transactionId);
        if (stat.data.result.success) {
            return 'paid';
        } else {
            return 'not paid';
        }
    } catch (error: any) {
        return 'error';
    }
};

export { paymentOptions, createInvoice };
