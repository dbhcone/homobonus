import { Request, Response } from 'express';
import {
    redeemTicketValidation,
    verifyScannedQrCodeValidation,
    verifyTicketValidation
} from '../validators/event.validations';
import { CResponse } from '../helpers/classes/response.class';
import Purchases from '../models/purchase.model';
import Redemptions from '../models/redemption.model';
import Users from '../models/user.model';
import { generatePin, ticketVerificationEmail } from '../helpers/functions/email.helper';
import { sendDtechSms } from '../helpers/functions/sms.helpers';
import { ticketVerificationMsg } from '../helpers/functions/messages.helpers';
import { decryptedPlainText } from '../helpers/functions/crypto.helpers';
import { addAttendance } from './attendance.controller';

const redeemTicket = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        // TODO: take away hard coded eventId and find a better way
        const eventId = '61ca54f7bb8c82000438117e';
        const validation = await redeemTicketValidation.validateAsync(data);
        const { userId, purchaseId, redemptionCode } = data;

        // check if the ticket has already been redeemed from purchases
        const checkRedeemed = await Purchases.findOne({ user: userId, _id: purchaseId, redeemed: true });
        if (checkRedeemed)
            return CResponse.error(res, { message: 'Sorry! This ticket has already been redeemed. Get a new one!' });

        const date = new Date();
        const updatedRedemption = await Redemptions.findOneAndUpdate(
            { ...data },
            { $set: { redeemed: true, dateRedeemed: date } },
            { new: true }
        );

        if (!updatedRedemption) return CResponse.error(res, { message: 'Sorry! Could not redeem your ticket' });

        // update purchases
        const updatePurchase = await Purchases.findOneAndUpdate(
            { user: userId, _id: purchaseId },
            { $set: { redeemed: true, dateOfRedemption: date } }
        );

        // add to attendance
        const addatt = await addAttendance(userId, eventId);
        if (addatt.status != 'ok') return CResponse.error(res, { message: addatt.message });

        return CResponse.success(res, { message: 'Authorisation completed successfully! Please enter' });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const verifyTicket = async (req: Request, res: Response) => {
    try {
        /**
         * TODO: get incoming encrypted text (string) from the scanned qr code
         * Decrypt it and parse it as a valid json with userId, purchaseId keys
         * Then go ahead to validate with schema and proceed.
         */

        const data = req.body;
        const validation = await verifyScannedQrCodeValidation.validateAsync(data);

        // decrypt
        let decryptedString = decryptedPlainText(data.scanResult);
        let decryptedObject = null;
        try {
            decryptedObject = JSON.parse(decryptedString);
        } catch (e: any) {
            return CResponse.error(res, {
                message: 'Invalid qr code. Please, try again or contact system admin',
                data: decryptedString
            });
        }

        const { userId, purchaseId } = decryptedObject;

        // check if ticket has been purchased
        const ticketPurchase = await Purchases.findOne({ _id: purchaseId, user: userId });
        if (!ticketPurchase) return CResponse.error(res, { message: 'Ticket purchase does not exist. Contact admin' });

        if (ticketPurchase.redeemed) {
            return CResponse.error(res, { message: 'Sorry! This ticket has already been redeemed. Get a new one!' });
        }

        // now check if there has already been a redemption
        const redemption = await Redemptions.findOne({ userId, purchaseId });
        if (!redemption) {
            const user = await Users.findById(userId).populate('accountOwner');
            if (user) {
                const email = user.email;
                const firstName = user.accountOwner?.firstName;
                const primaryMobileNumber = user.accountOwner?.primaryMobileNumber;

                const pin = generatePin(6);

                const newRedemption = { userId, purchaseId, redemptionCode: pin };
                const redemptionData = await new Redemptions(newRedemption).save();

                // send email
                const mail = await ticketVerificationEmail(firstName, email, pin);

                // TODO: Send sms - Uncomment for production deployment
                const sms = await sendDtechSms(ticketVerificationMsg(firstName, pin), primaryMobileNumber);

                return CResponse.success(res, {
                    message: 'Check your email or SMS for authorisation code',
                    data: { userId, purchaseId }
                });
            }
            return CResponse.error(res, { message: 'Could not fetch user details to send authorisation code' });
        }

        if (redemption && redemption.redeemed) {
            return CResponse.error(res, {
                message: 'This ticket has already been redeemed. Kindly scan a different one'
            });
        } else {
            {
                return CResponse.error(res, {
                    message: 'Code sent already. Check spam or your SMS once again'
                });
            }
        }
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

export { redeemTicket, verifyTicket };
