import { Document } from "mongoose";
import { IAccount } from "./account.interface";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: string;
  accountOwner: IAccount['_id'];
  profilePhoto?: IProfilePhoto;
  status: string;
}

export interface IProfilePhoto {
  path?: string;
  filename?: string;
  mimetype?: string;
  originalname?: string;
  destination?: string;
  encoding?: string;
}
