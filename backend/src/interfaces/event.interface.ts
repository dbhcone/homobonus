import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IEvent extends Document {
    title: string;
    date: Date;
    time: string;
    capacity: string;
    venue: string;
    flyer?: { mimetype: string; filename: string; size: string | number };
    extraDetails?: [];
    description: string;
    // photos?: string[];
}

export interface IPurchase extends Document {
    user: IUser['_id'];
    tickets: ITicket[];
    total: number;
    qrcode?: string;
    redeemed?: boolean;
    dateOfRedemption?: Date;
}

export interface IPricing extends Document {
    event: IEvent['_id'];
    pricing: IPrice;
}

export interface IPrice {
    name: string;
    allowableNumberOfPersons: number;
    amount: number;
}

export interface ITicket {
    eventId: string;
    eventName: string;
    ticketType: string;
    unitPrice: number;
    quantity: number;
    subTotal: number;
}

export interface IRedemption extends Document {
    userId: string;
    purchaseId: string;
    redemptionCode: string;
    redeemed?: boolean;
    dateRedeemed?: Date;
}
