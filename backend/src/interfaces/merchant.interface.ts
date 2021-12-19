import { Document } from "mongoose";

export interface IMerchant extends Document {
  email: string;
  username: string;
  password: string;
  organisationName: string;
  mobileNumber: string;
  status: string;
}
