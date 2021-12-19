import mongoose, {Schema} from 'mongoose';
import { IAccount } from '../interfaces/account.interface';


const AccountSchema: Schema = new Schema ({
    surname: { type: String, required: true },
    firstName: { type: String, required: true },
    otherNames: { type: String, default: null },
    gender: { type: String, required: true },
    primaryMobileNumber: { type: String, required: true },
    otherNumbers: [{type:String}],
    occupation: { type: String, default: null }
})

export default mongoose.model<IAccount>('Accounts', AccountSchema);