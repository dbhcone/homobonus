import { Request, Response } from 'express';
import { createPurchase } from '../validators/event.validations';
import Pricings from '../models/pricings.model';
import Purchase from '../models/purchase.model';
import qr from 'qrcode';
import { sendTicketEmail } from '../helpers/functions/email.helper';
import Users from '../models/user.model';
import { ITicket } from '../interfaces/event.interface';
import { CResponse } from '../helpers/classes/response.class';
import { encryptedPlainText } from '../helpers/functions/crypto.helpers';

const create = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const validation = await createPurchase.validateAsync(data);
        // let { user, items, paymentDetails } = data;
        let { user, items } = data;
        const newItems = <any[]>items;

        // console.log('data', data);

        let tickets: ITicket[] = [];

        const ids: any[] = [];
        newItems.map(item => {
            ids.push(item.id);
        });
        console.log('ids', ids);
        const prs = await Pricings.find({ _id: { $in: [...ids] } }).populate('event');
        console.log('prs', prs);
        // return res.status(200).json({ data: { prs, ids } });

        prs.map(pr => {
            let foundItem = newItems.find(item => item.id == pr._id);
            if (foundItem) {
                console.log('found', foundItem);
                const ticket: ITicket = {
                    eventId: foundItem.eventId,
                    eventName: pr.event.title,
                    ticketType: pr.pricing.name,
                    unitPrice: pr.pricing.amount,
                    quantity: foundItem.quantity,
                    subTotal: pr.pricing.amount * foundItem.quantity
                };
                console.log('ticket', ticket);
                tickets.push(ticket);
            }
        });

        let total = 0;
        tickets.map(ticket => {
            total += ticket.subTotal;
        });

        console.log('tickets', tickets);

        /**
         * TODO: Trigger payment and confirm before adding to
         * purchase document. Verify payment first.
         */
        let purch = { user: user.id, tickets: tickets, total: total };
        let purchase = await new Purchase(purch).save();
        console.log('purchase', purchase);
        try {
            let udata = { userId: user.id, purchaseId: purchase.id };
            const encryptedData = encryptedPlainText(JSON.stringify(udata));

            qr.toDataURL(encryptedData, async (err, qrcode) => {
                if (err) {
                    return res.status(404).json({
                        message: 'Could not generate qr code',
                        code: 404,
                        status: 'ok'
                    });
                }

                const updatedPurchase = await Purchase.findByIdAndUpdate(purchase._id, { qrcode }, { new: true });
                // const updatedPurchase = await purchase.updateOne({ qrcode }, { new: true });
                console.log('updated purchase', updatedPurchase);

                const us = await Users.findById(user.id).populate('accountOwner');

                // now send the email
                if (tickets.length > 0) {
                    let response = await sendTicketEmail(
                        user.email,
                        us?.accountOwner?.firstName,
                        tickets,
                        updatedPurchase?._id
                    );

                    if (response.code == 200) {
                        return res.status(200).json({
                            message: 'Purchase completed successfully. Check your email to get full details',
                            status: 'ok',
                            code: 200,
                            data: updatedPurchase
                        });
                    } else {
                        return res.status(response.code).json({
                            message: response.message,
                            status: 'error',
                            code: response.code,
                            data: purchase
                        });
                    }
                }
            });
        } catch (error: any) {
            return res.status(404).json({ message: error.message, code: 404, status: 'error' });
        }
    } catch (error: any) {
        return res.status(404).json({ message: error.message, code: 404, status: 'error' });
    }
};

/** TODO:
 * Call this method only **AFTER** payment has been confirmed
 * @param req Request
 * @param res Response
 */
// const savePayment = async (user: any, purchase: any) => {
//     let purch = { user: user.id, tickets: tickets, total: total };
//         let purchase = await new Purchase(purch).save();
//         console.log('purchase', purchase);
//     try {
//         let udata = { userId: user.id, purchaseId: purchase.id };
//         const encryptedData = encryptedPlainText(JSON.stringify(udata));

//         qr.toDataURL(encryptedData, async (err, qrcode) => {
//             if (err) {
//                 return res.status(404).json({
//                     message: 'Could not generate qr code',
//                     code: 404,
//                     status: 'ok',
//                 });
//             }

//             await purchase.updateOne({ qrcode }, { new: true });
//             console.log('updated', purchase);

//             const us = await Users.findById(user.id).populate(
//                 'accountOwner'
//             );

//             // now send the email
//             let response = await sendTicketEmail(
//                 user.email,
//                 us?.accountOwner?.firstName,
//                 tickets,
//                 qrcode
//             );

//             if (response.code == 200) {
//                 return res.status(200).json({
//                     message:
//                         'Purchase completed successfully. Check your email to get full details',
//                     status: 'ok',
//                     code: 200,
//                     data: purchase,
//                 });
//             } else {
//                 return res.status(response.code).json({
//                     message: response.message,
//                     status: 'error',
//                     code: response.code,
//                     data: purchase,
//                 });
//             }
//         });
//     } catch (error: any) {
//         return res
//             .status(404)
//             .json({ message: error.message, code: 404, status: 'error' });
//     }
// }

const read = async (req: Request, res: Response) => {
    try {
        const allPurchases = await Purchase.find();

        return CResponse.success(res, {
            message: 'Success',
            data: allPurchases
        });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const readOne = async (req: Request, res: Response) => {
    try {
        const purchaseId = req.params['purchaseId'];
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) return CResponse.error(res, { message: 'Could not find purchase' });

        return CResponse.success(res, {
            message: 'Purchase details fetched',
            data: purchase
        });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const readOneUserPurchase = async (req: Request, res: Response) => {
    try {
        const purchaseId = req.params['purchaseId'];
        const userId = req.params['userId'];
        const userPurchase = await Purchase.findOne({ _id: purchaseId, user: userId });
        if (!userPurchase) return CResponse.error(res, { message: 'Could not find userPurchase' });

        return CResponse.success(res, {
            message: 'Purchase details fetched',
            data: userPurchase
        });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

const _delete = async (req: Request, res: Response) => {
    try {
        const purchaseId = req.params['purchaseId'];

        const deletedPurchase = await Purchase.findByIdAndDelete(purchaseId);
        if (!deletedPurchase)
            return CResponse.error(res, {
                message: 'Could not delete purchase'
            });

        return CResponse.success(res, {
            message: 'Successfully deleted purchase',
            data: deletedPurchase
        });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

export { create, read, readOne, _delete, readOneUserPurchase };
