import { NextFunction, Request, Response } from 'express';
import Account from '../models/account.model';
import Users from '../models/user.model';
import { mongoidValidation } from '../validators/shared.validations';
import Purchase from '../models/purchase.model';
import { CResponse } from '../helpers/classes/response.class';
// import config from 'config';
// import fs from 'fs';

// import { Dropbox, files } from 'dropbox';

const GetUserDetails = async (req: any, res: Response) => {
    try {
        if (req.userData == null) return CResponse.error(res, { message: 'Could not find user' });

        return res.status(200).json({
            status: 'ok',
            message: 'User data fetched successfully',
            data: req.userData
        });
    } catch (error: any) {
        return res.status(404).json({ error: error.message, code: 404, status: 'error' });
    }
};

const UploadProfilePhoto = async (req: any, res: Response, next: NextFunction) => {
    try {
        const validation = await mongoidValidation.validateAsync(req.body);

        if (!req.file) {
            console.log('no file at the moment');
            return res.status(400).json({
                message: 'Select a file to be uploaded',
                status: 'error',
                code: 400
            });
        } else {
            const { buffer, ...fileOtherDetails } = req.file;
            console.log('we have a file excl. buffer', fileOtherDetails);

            // find the account
            const account = await Account.findById(req.body._id);

            if (!account) {
                return res.status(404).json({
                    message: 'Account does not exist',
                    status: 'error',
                    code: 404
                });
            }

            const updateProfile = await Users.findOneAndUpdate(
                { accountOwner: account._id },
                { $set: { profilePhoto: { ...fileOtherDetails } } }
            );

            if (!updateProfile) {
                return res.status(404).json({
                    message: 'Could not find user to update',
                    status: 'error',
                    code: 404
                });
            }

            return res.status(200).json({
                data: updateProfile,
                status: 'ok',
                code: 200,
                message: 'Profile photo updated successfully'
            });

            //#region ========== Dropbox upload (TODO) ===========
            /*
        try {
            const accessToken = <string>config.get('DROPBOX_ACCESS_TOKEN');
            const clientSecret = <string>config.get('DROPBOX_APP_SECRET');
            const dbx = new Dropbox({ accessToken, clientSecret });
            let upload = await dbx.filesUpload({
                path: `/${req.file.filename}`,
                mute: false,
                strict_conflict: false,
                autorename: false,
            });
            return res.status(201).json({ code: 201, data: upload, message: 'Upload successful' });
        } catch (error: any) {
            // console.log(error.code);
            return res.status(404).json({ status: 'error', message: error.message, code: 404 });
        }
        */
            //#endregion
        }
    } catch (error: any) {
        return res.status(404).json({ status: 'error', message: error.message, code: 404 });
    }
};

const GetUserPurchases = async (req: Request, res: Response) => {
    try {
        const userId = req.params['userId'];
        const userPurchases = await Purchase.find({ user: userId });
        const count = userPurchases.length;

        let message = count > 0 ? 'Fetched user purchases' : 'No purchases found';
        return CResponse.success(res, { message, data: { count, purchases: userPurchases } });
    } catch (error: any) {
        return CResponse.error(res, { message: error.message });
    }
};

export { GetUserDetails, UploadProfilePhoto, GetUserPurchases };
