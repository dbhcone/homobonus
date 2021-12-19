/**
 * https://documenter.getpostman.com/view/8139575/TVYJ6HHZ
 */
 import * as dotenv from 'dotenv';
 import path from 'path';
 const envpath = path.join(__dirname, '../../.env');
 console.log('env path bill', envpath);
 dotenv.config({path: envpath});
import { POST } from '../helpers/functions/http';
import { IInvoiceWithItems, IInvoiceWithoutItems, IPayNow } from '../interfaces/billbox.interface';

const BASE_URL = process.env.BASE_URL;
const APP_ID = process.env.APP_ID;
const APP_REFERENCE = process.env.APP_REFERENCE;
const SECRET = process.env.SECRET;
const SERVICE_CODE = process.env.SERVICE_CODE;

const URL = (endpoint: string) => {
    return `${BASE_URL}${endpoint}`;
};

const defaultData = { appReference: APP_REFERENCE, secret: SECRET };

const listPaymentOptions = (requestId: string) => {
    const url = URL('/webpos/listPayOptions');
    const data = { requestId, ...defaultData };

    return POST(url, data, { appId: APP_ID });
};

const createInvoiceWithItems = (requestId: string, invoiceData: IInvoiceWithItems) => {
    const url = URL('/webpos/createInvoice');
    const data = { requestId, ...defaultData, ...invoiceData };

    return POST(url, data, { appId: APP_ID });
};

const createInvoiceWithoutItems = (requestId: string, invoiceData: IInvoiceWithoutItems) => {
    const url = URL('/webpos/createInvoice');
    const data = { requestId, ...defaultData,...invoiceData };

    return POST(url, data, { appId: APP_ID });
};

const getInvoiceSummary = () => {};

const getInvoice = () => {};

const cancelInvoice = (requestId: string) => {
    const url = URL('/webpos/cancelInvoice');
    const data = {};
    
    return POST(url, data, { appId: APP_ID });
};

const processPayment = () => {};

const payNow = (requestId: string, payNowData: IPayNow ) => {
    const url = URL('/webpos/payNow');
    const data = {requestId, serviceCode: SERVICE_CODE, ...defaultData,...payNowData };

    return POST(url, data, { appId: APP_ID });
};

const checkPaymentStatus = (requestId: string, transactionId: string) => {
    const url = URL('/webpos/checkPaymentStatus');
    const data = { requestId, ...defaultData, transactionId };

    return POST(url, data, { appId: APP_ID });
};

export {
    listPaymentOptions,
    createInvoiceWithItems,
    createInvoiceWithoutItems,
    getInvoiceSummary,
    getInvoice,
    cancelInvoice,
    processPayment,
    payNow,
    checkPaymentStatus
};
