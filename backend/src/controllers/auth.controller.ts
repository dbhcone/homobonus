import { Request, Response } from 'express';
import { decodeToken, generateToken } from '../helpers/functions/auth.helpers';
import { IAccount } from '../interfaces/account.interface';
import { IUser } from '../interfaces/user.interface';
import md5 from 'md5';

import Account from '../models/account.model';
import Users from '../models/user.model';
import PasswordResets from '../models/passwordreset.model';
import Activations from '../models/user.activations.model';
import Merchants from '../models/merchant.model';

// import validations
import {
    userValidation,
    loginValidation,
    accountValidation,
    accountUpdateValidation,
    accountActivationValidation,
    requestPasswordResetValidation,
    passwordResetValidation,
    merchantAccountValidation
} from '../validators/auth.validations';
import {
    accountActivationEmail,
    generatePin,
    merchantAccountActivationEmail,
    passwordResetRequestEmail
} from '../helpers/functions/email.helper';

import { intlTelNumberGh, sendDtechSms } from '../helpers/functions/sms.helpers';
import { accountCreationMsg } from '../helpers/functions/messages.helpers';
import { CResponse } from '../helpers/classes/response.class';
import { IMerchant } from '../interfaces/merchant.interface';

const Signup = async (req: Request, res: Response) => {
    let user: IUser, account: IAccount;
    const data = req.body;

    if (!data.account) {
        return res.status(404).json({ error: 'account object required in body' });
    }

    if (!data.user) {
        return res.status(404).json({ error: 'user object required in body' });
    }

    const userdata = { ...data.user, password: md5(data.user.password) };

    user = <IUser>userdata;
    account = <IAccount>data.account;

    /**
     * Validate request body [account, user]
     * - account first
     * - followed by user
     */
    //
    try {
        let validation = await accountValidation.validateAsync(account);
        console.log('Account validation completed', validation);

        try {
            let uValidation = await userValidation.validateAsync(user);
            console.log('User validation completed', uValidation);

            // now create a new account for the person
            let accountData = await new Account(account).save();

            if (accountData) {
                console.log('Account creation data', accountData);

                // now pick the _id of that account and set it to the user
                user.accountOwner = accountData._id;

                // now create a user
                let userData = await new Users(user).save();

                if (userData) {
                    console.log('User creation data', userData);
                    /**
                     * We are here because user account has been
                     * successfully saved into the temp tables.
                     * Now send email to account account.
                     */
                    //Generate token
                    const temp_token = generateToken(
                        { email: user.email, username: user.username, role: 'user', id: userData._id },
                        '24h'
                    );

                    const pin = generatePin(6);
                    // try sending sms only if there was a primary number
                    // if (account.primaryMobileNumber) {
                    //     const standardNumber = intlTelNumberGh(account.primaryMobileNumber);

                    //     if (standardNumber) {
                    //         const sendSMS = await sendDtechSms(
                    //             accountCreationMsg(account.firstName, temp_token, pin),
                    //             standardNumber
                    //         );
                    //         console.log('sms response', sendSMS, standardNumber);
                    //     }
                    // }

                    const sendmail = await accountActivationEmail(account.firstName, temp_token, user.email, pin);

                    if (sendmail.status == 'ok') {
                        // save the pin and email to activations to be later verified
                        const activation = await new Activations({
                            email: user.email,
                            pin,
                            mobileNumber: account.primaryMobileNumber
                        }).save();
                        return res.status(201).json({
                            message: 'A link has been sent to your email. Kindly follow to activate your account!',
                            code: 201,
                            status: 'ok'
                        });
                    }
                } else {
                    return res.status(400).json({
                        message: 'Could not create user',
                        code: 400,
                        status: 'error'
                    });
                }
            } else {
                return res.status(400).json({
                    message: 'Account creation failed',
                    code: 400,
                    status: 'error'
                });
            }
        } catch (error: any) {
            console.log('User Validation error', error.message);
            return res.status(404).send({ code: 404, status: 'error', message: error.message });
        }
    } catch (error: any) {
        console.log('Account Validation error', error.message);
        return res.status(404).send({ code: 404, status: 'error', message: error.message });
    }
};

const Login = async (req: Request, res: Response) => {
    let { username, password } = req.body;

    try {
        const validation = await loginValidation.validateAsync(req.body);

        // hash password and find
        password = md5(password);
        // const user = await Users.findOne({ username, password, role });
        const user = await Users.findOne({ password, $or: [{ username }, { email: username }] });

        if (!user) {
            return res.status(403).json({ code: 403, message: 'Invalid credentials', status: 'error' });
        }

        // check if user has activated account already
        if (user.status != 'active') {
            return res
                .status(403)
                .json({ code: 403, message: 'Account has not been activated. Request one now!', status: 'error' });
        }

        let token = generateToken({ username: user.username, role: user.role, id: user._id, email: user.email }, '7d');

        return res.status(200).json({ message: 'Login successful!', token, code: 200, status: 'ok' });
    } catch (error: any) {
        console.log('logging in', error.message);
        return res.status(404).send({ code: 404, status: 'error', message: error.message });
    }
};

const UsersList = async (req: any, res: Response) => {
    try {
        if (req.userData == null) return CResponse.error(res, { message: 'Access denied' });
        if (req.userData && req.userData.role !== 'admin')
            return CResponse.error(res, { message: 'You do not have authorization!' });
        let data = await Users.find({});
        return res.status(200).json({ message: '', status: 'ok', code: 200, data });
    } catch (error: any) {
        console.log('Error fetching users', error.message);
        return res.status(404).send({
            status: 'error',
            message: 'Error fetching user details',
            code: 404
        });
    }
};

const AccountList = async (req: any, res: Response) => {
    try {
        if (req.userData == null) return CResponse.error(res, { message: 'Access denied' });
        if (req.userData && req.userData.role !== 'admin')
            return CResponse.error(res, { message: 'You do not have authorization!' });
        let data = await Users.find({}).populate('accountOwner');
        return res.status(200).json({
            code: 200,
            message: 'Members list fetched successfully',
            status: 'ok',
            data
        });
    } catch (error: any) {
        console.log('Error fetching members list', error.message);
        return res.status(404).json({ code: 404, message: error.message, status: 'error' });
    }
};

const DeleteUser = async (req: any, res: Response) => {
    // this is not going to set a status flag, it is actually going to perform a delete
    try {
        if (req.userData == null) return CResponse.error(res, { message: 'Access denied' });
        if (req.userData && req.userData.role !== 'admin')
            return CResponse.error(res, { message: 'You do not have authorization!' });
        const { _id } = req.body;
        if (!_id) {
            return res.status(404).json({ message: 'User id is required', status: 'error', code: 404 });
        }
        /**
         * Use the _id received to delete from accounts
         * Use that _id to pick the document with owner from users
         * then delete
         */
        const account = await Account.findByIdAndDelete(_id);
        if (account) {
            // we were able to remove that account (member details)
            const user = await Users.findOne({ accountOwner: _id });

            console.log('user delete?', user);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User does not exist. Delete failed.',
                    code: 404
                });
            }
            return res.status(200).json({
                status: 'ok',
                message: 'User account deleted successfully',
                code: 200,
                data: user
            });
        } else {
            return res.status(404).json({
                code: 404,
                status: 'error',
                message: 'User account does not exist'
            });
        }
    } catch (error: any) {
        return res.status(404).json({ status: 'error', message: error.message, code: 404 });
    }
};

const UpdateMember = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const { _id, updateData } = data;

        const validation = await accountUpdateValidation.validateAsync(data);
        console.log('Validation', validation);

        const account = await Account.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
        console.log('account', account);

        if (account) {
            return res.status(200).json({
                data: account,
                message: 'Account details updated successfully!',
                code: 200
            });
        } else {
            return res.status(404).json({
                error: { message: 'Could not find account to be updated' },
                code: 404
            });
        }
    } catch (error: any) {
        return res.status(404).json({ message: error.message, code: 404, status: 'error' });
    }
};

const MembersStats = async (req: Request, res: Response) => {
    try {
        const males = await Account.countDocuments({ gender: 'M' });
        const females = await Account.countDocuments({ gender: 'F' });

        /**
         * we are not summing up males and female for `total` because we are
         * making way for members in the group who may **NOT** be in either of
         * the two categories.
         */
        const total = await Account.countDocuments();
        const occupations = await Account.aggregate([
            { $group: { _id: { $toLower: '$occupation' }, num: { $sum: 1 } } }
        ]);
        return res.status(200).json({
            message: 'Data fetched successfully',
            status: 'ok',
            code: 200,
            data: { males, females, total, occupations }
        });
    } catch (error: any) {
        return res.status(404).json({ message: error.message, status: 'error', code: 404 });
    }
};

const ActivateAccount = async (req: any, res: Response) => {
    try {
        const validation = await accountActivationValidation.validateAsync(req.body);

        // const { token, pin, mobileNumber } = req.body;
        const { pin, mobileNumber } = req.body;

        const activation = await Activations.findOne({ mobileNumber, pin });

        if (activation) {
            // found. now update the status in users and delete from activations
            // const user = await Users.findOneAndUpdate({ email: dc.email }, { $set: { status: 'active' } });

            if (req.merchantData) {
                const merchant = await Merchants.findByIdAndUpdate(req.merchantData._id, {
                    $set: { status: 'active' }
                });
                if (!merchant) {
                    return res.status(404).json({
                        message: 'Could not activate your account. Check and try again!',
                        status: 'error',
                        code: 404
                    });
                }
                const del = await Activations.deleteMany({ mobileNumber, pin });
                return res.status(200).json({
                    message: 'Account activation successful!',
                    status: 'ok',
                    code: 200
                });
            } else if (req.userData) {
                const acc = await Account.findOne({ primaryMobileNumber: mobileNumber });
                if (!acc) {
                    return res.status(404).json({
                        message: 'Could not verify mobile number. Check and try again!',
                        status: 'error',
                        code: 404
                    });
                }
                const user = await Users.findOneAndUpdate({ accountOwner: acc._id }, { $set: { status: 'active' } });

                const del = await Activations.deleteMany({ mobileNumber, pin });
                console.log('activations deleted', del);
                if (user) {
                    // activation successful
                    return res.status(200).json({
                        message: 'Account activation successful!',
                        status: 'ok',
                        code: 200
                    });
                } else {
                    // unsuccessful activation
                    return res.status(404).json({
                        message: 'Could not activate account!',
                        status: 'error',
                        code: 404
                    });
                }
            }
        } else {
            // activation not found
            return res.status(404).json({
                message: 'No pending activations with this user and pin. Request one now!',
                status: 'error',
                code: 404
            });
        }
        // } else {
        //     return res.status(404).json({ message: decoded.message, status: 'error', code: 404 });
        // }
    } catch (error: any) {
        return res.status(404).json({ message: error.message, status: 'error', code: 404 });
    }
};

const RequestPasswordReset = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const validation = await requestPasswordResetValidation.validateAsync(data);

        const user = await Users.findOne({ email: data.email, status: 'active' }).populate({ path: 'accountOwner' });

        if (!user)
            return CResponse.error(res, {
                message: 'There is no user associated with this email. Please, check and try again.'
            });

        const temp_pin = generatePin(6);
        const temp_token = generateToken({ action: 'Password reset', email: data.email }, '1d');

        const reset = await new PasswordResets({ pin: temp_pin, token: temp_token, email: data.email }).save();
        const sendmail = await passwordResetRequestEmail(user.accountOwner.firstName, temp_token, data.email, temp_pin);

        return CResponse.success(res, {
            message: 'Password reset request sent. Check your email and follow the link'
        });
    } catch (error: any) {
        return res.status(404).json({ message: error.message, status: 'error', code: 404 });
    }
};

const ResetPassword = async (req: Request, res: Response) => {
    try {
        // may not necessarily be relevant
        if (!req.body) return CResponse.error(res, { message: 'Body is required' });
        const validation = await passwordResetValidation.validateAsync(req.body);

        const data = req.body;

        // check for the details in password reset
        const { pin, token, newPassword, confirmPassword } = data;

        // decode token
        const decodedToken = decodeToken(token);

        if (decodedToken.data == null) return CResponse.error(res, { message: 'Invalid token passed' });

        const { email } = decodedToken.data;

        if (newPassword !== confirmPassword)
            return CResponse.error(res, { message: 'Passwords do not match. Please, check and try again' });
        const checkReset = await PasswordResets.findOne({ pin, token, email });

        if (!checkReset)
            return CResponse.error(res, {
                message: 'No password request available. Check your pin and try again or request one now!'
            });

        const hashedPassword = md5(newPassword);
        const user = await Users.findOneAndUpdate({ email }, { $set: { password: hashedPassword } });

        if (!user) return CResponse.error(res, { message: 'Could not reset password' });

        return res.status(200).json({
            message: 'Password reset was successful',
            status: 'ok',
            code: 200
        });
    } catch (error: any) {
        return res.status(404).json({ message: error.message, status: 'error', code: 404 });
    }
};

const MerchantSignup = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        let validation = await merchantAccountValidation.validateAsync(data);
        const merchantData = { ...data, password: md5(data.password) };

        let merchant: IMerchant = merchantData;

        // now create a merchant
        let newMerchant = await new Merchants(merchant).save();

        if (newMerchant) {
            console.log('Merchant creation data', newMerchant);

            //Generate token
            const temp_token = generateToken(
                { email: merchant.email, username: merchant.username, role: 'merchant', id: newMerchant._id },
                '24h'
            );

            const pin = generatePin(6);
            // try sending sms only if there was a mobile number
            // if (merchant.mobileNumber) {
            //     const standardNumber = intlTelNumberGh(merchant.mobileNumber);

            //     if (standardNumber) {
            //         const sendSMS = await sendDtechSms(
            //             accountCreationMsg(merchant.organisationName, temp_token, pin),
            //             standardNumber
            //         );
            //         console.log('sms response', sendSMS, standardNumber);
            //     }
            // }

            const sendmail = await merchantAccountActivationEmail(
                merchant.ownerName,
                merchant.organisationName,
                temp_token,
                merchant.email,
                pin
            );

            if (sendmail.status == 'ok') {
                // save the pin and email to activations to be later verified
                const activation = await new Activations({
                    email: merchant.email,
                    pin,
                    mobileNumber: merchant.mobileNumber
                }).save();
                return res.status(201).json({
                    message: 'A link has been sent to your email. Kindly follow to activate your account!',
                    code: 201,
                    status: 'ok'
                });
            }
        } else {
            return res.status(400).json({
                message: 'Could not create merchant',
                code: 400,
                status: 'error'
            });
        }
    } catch (error: any) {
        return res.status(404).send({ code: 404, status: 'error', message: error.message });
    }
};

export {
    Signup,
    Login,
    UsersList,
    AccountList,
    DeleteUser,
    UpdateMember,
    MembersStats,
    ActivateAccount,
    RequestPasswordReset,
    ResetPassword,
    MerchantSignup
};
