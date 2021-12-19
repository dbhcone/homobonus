export interface IPaymentOptions {
    // requestId: string;
}

export interface IInvoiceWithItems {
    // requestId: string;

    merchantOrderId: string;
    reference: string;
    currency: 'GHS' | 'USD';
    invoiceItems: IInvoiceItems[];
}

interface IInvoiceItems {
    name: string;
    description: string;
    imgUrl: string;
    unitPrice: number;
    quantity: number;
    subTotal: number;
}

export interface IInvoiceWithoutItems {
    merchantOrderId: string;
    currency: 'GHS' | 'USD';
    reference: string;
    amount: number;
}

export interface IIvoiceSummaryWInvNum {
    // requestId: string;

    invoiceNum: string;
}

export interface IInvoiceSummaryWMerchOId {
    // requestId: string;

    merchantOrderId: string;
}

export interface IInvoiceFullWInvNum {
    // requestId: string;

    invoiceNum: string;
}

export interface IInvoiceFullWMerchOId {
    // requestId: string;

    merchantOrderId: string;
}

export interface ICancelInvoice {
    // requestId: string;

    merchantOrderId: string;
}

export interface IProcessPayment {
    // requestId: string;
    invoiceNum: string;
    transactionId: string;
    provider:
        | 'MTN_MONEY'
        | 'CARD'
        | 'VODAFONE_CASH'
        | 'AIRTELTIGO_MONEY'
        | 'SLYDEPAY'
        | 'STANBIC_BANK';
    walletRef: string;
    customerName: string;
    customerMobile: string;
}

export interface IPayNow {
    // requestId: string;

    amount: number;
    currency: 'GHS' | 'USD';
    transactionId: string;
    reference: string;
    provider:
        | 'MTN_MONEY'
        | 'CARD'
        | 'VODAFONE_CASH'
        | 'AIRTELTIGO_MONEY'
        | 'SLYDEPAY'
        | 'STANBIC_BANK';
    walletRef: string;
    customerName: string;
    customerMobile: string;
}
