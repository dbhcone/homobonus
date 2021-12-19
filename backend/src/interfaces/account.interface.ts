import { Document } from 'mongoose';

export interface IAccount extends Document {
  surname: string;
  firstName: string;
  otherNames?: string;
  gender: string;
  primaryMobileNumber: string;
  otherNumbers: string[];
  occupation: string;
}
