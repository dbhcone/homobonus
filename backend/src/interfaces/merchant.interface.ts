import { Document } from 'mongoose';

export interface IMerchant extends Document {
    email: string;
    username: string;
    password: string;
    organisationName: string;
    typeOfOrganisation: string;
    ownerName: string;
    mobileNumber: string;
    address?: string;
    ghPostAddress?: string;
}
