import { Request, Response } from 'express';
import { decodeToken, generateToken } from '../helpers/functions/auth.helpers';
import { IAccount } from '../interfaces/account.interface';
import { IUser } from '../interfaces/user.interface';
import md5 from 'md5';

import Account from '../models/account.model';
import Users from '../models/user.model';
import Activations from '../models/user.activations.model';

// import validations
import {
  userValidation,
  loginValidation,
  accountValidation,
  accountUpdateValidation,
  accountActivationValidation,
} from '../validators/auth.validations';
import {
  accountActivationEmail,
  generatePin,
} from '../helpers/functions/email.helper';

import {intlTelNumberGh, sendDtechSms} from '../helpers/functions/sms.helpers';
import { accountCreationMsg } from '../helpers/functions/messages.helpers';

const Signup = async (req: Request, res: Response) => {
  let user: IUser, account: IAccount;
  const data = req.body;

  if (!data.account) {
    return res.status(404).json({ error: 'account object required in body' });
  }

  if (!data.user) {
    return res.status(404).json({ error: 'user object required in body' });
  }

  const userdata = {...data.user, password: md5(data.user.password)};

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
            { email: user.email, username: user.username },
            '24h'
          );

          const pin = generatePin(6);
          // try sending sms only if there was a primary number
          if (account.primaryMobileNumber) {
            const standardNumber = intlTelNumberGh(account.primaryMobileNumber);

            if (standardNumber) {
              const sendSMS = await sendDtechSms(accountCreationMsg(account.firstName, temp_token, pin), standardNumber);
              console.log('sms response', sendSMS, standardNumber)
            }
          }

          const sendmail = await accountActivationEmail(
            account.firstName,
            temp_token,
            user.email,
            pin
          );

          if (sendmail.status == 'ok') {
            // save the pin and email to activations to be later verified
            const activation = await new Activations({
              email: user.email,
              pin,
            }).save();
            return res.status(201).json({
              message:
                'A link has been sent to your email. Kindly follow to activate your account!',
              code: 201,
              status: 'ok',
            });
          }

        } else {
          return res.status(400).json({
            message: 'Could not create user',
            code: 400,
            status: 'error',
          });
        }
      } else {
        return res.status(400).json({
          message: 'Account creation failed',
          code: 400,
          status: 'error',
        });
      }
    } catch (error: any) {
      console.log('User Validation error', error.message);
      return res
        .status(404)
        .send({ code: 404, status: 'error', message: error.message });
    }
  } catch (error: any) {
    console.log('Account Validation error', error.message);
    return res
      .status(404)
      .send({ code: 404, status: 'error', message: error.message });
  }
};

const Login = async (req: Request, res: Response) => {
  let { username, password, isAdmin } = req.body;

  try {
    const validation = await loginValidation.validateAsync(req.body);
    const role = isAdmin ? 'admin' : 'user';

    // hash password and find
    password = md5(password)
    // const user = await Users.findOne({ username, password, role });
    const user = await Users.findOne({password, role, $or: [{username}, {email: username}]});

    if (!user) {
      return res
        .status(403)
        .json({ code: 403, message: 'Invalid credentials', status: 'error' });
    }

    // check if user has activated account already
    if(user.status != 'active') {
      return res.status(403).json({code: 403, message: 'Account has not been activated. Request one now!', status: 'error'})
    }

    let token = generateToken(
      { username: user.username, role: user.role, id: user._id, email: user.email },
      '2h'
    );

    return res
      .status(200)
      .json({ message: 'Login successful!', token, code: 200, status: 'ok' });
  } catch (error: any) {
    console.log('logging in', error.message);
    return res
      .status(404)
      .send({ code: 404, status: 'error', message: error.message });
  }
};

const UsersList = async (req: Request, res: Response) => {
  try {
    let data = await Users.find({});
    return res.status(200).json({ message: '', status: 'ok', code: 200, data });
  } catch (error: any) {
    console.log('Error fetching users', error.message);
    return res.status(404).send({
      status: 'error',
      message: 'Error fetching user details',
      code: 404,
    });
  }
};

const MembersList = async (req: Request, res: Response) => {
  try {
    let data = await Users.find({}).populate('accountOwner');
    return res.status(200).json({
      code: 200,
      message: 'Members list fetched successfully',
      status: 'ok',
      data,
    });
  } catch (error: any) {
    console.log('Error fetching members list', error.message);
    return res
      .status(404)
      .json({ code: 404, message: error.message, status: 'error' });
  }
};

const DeleteUser = async (req: Request, res: Response) => {
  // this is not going to set a status flag, it is actually going to perform a delete
  const { _id } = req.body;
  if (!_id) {
    return res
      .status(404)
      .json({ message: 'User id is required', status: 'error', code: 404 });
  }
  /**
   * Use the _id received to delete from accounts
   * Use that _id to pick the document with owner from users
   * then delete
   */
  try {
    const account = await Account.findByIdAndDelete(_id);
    if (account) {
      // we were able to remove that account (member details)
      const user = await Users.findOne({ accountOwner: _id });

      console.log('user delete?', user);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist. Delete failed.',
          code: 404,
        });
      }
      return res.status(200).json({
        status: 'ok',
        message: 'User account deleted successfully',
        code: 200,
        data: user,
      });
    } else {
      return res.status(404).json({
        code: 404,
        status: 'error',
        message: 'User account does not exist',
      });
    }
  } catch (error: any) {
    return res
      .status(404)
      .json({ status: 'error', message: error.message, code: 404 });
  }
};

const UpdateMember = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const { _id, updateData } = data;

    const validation = await accountUpdateValidation.validateAsync(data);
    console.log('Validation', validation);

    const account = await Account.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );
    console.log('account', account);

    if (account) {
      return res.status(200).json({
        data: account,
        message: 'Account details updated successfully!',
        code: 200,
      });
    } else {
      return res.status(404).json({
        error: { message: 'Could not find account to be updated' },
        code: 404,
      });
    }
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: error.message, code: 404, status: 'error' });
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
      { $group: { _id: { $toLower: '$occupation' }, num: { $sum: 1 } } },
    ]);
    return res.status(200).json({
      message: 'Data fetched successfully',
      status: 'ok',
      code: 200,
      data: { males, females, total, occupations },
    });
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: error.message, status: 'error', code: 404 });
  }
};

const ActivateAccount = async (req: Request, res: Response) => {
  try {
    const validation = await accountActivationValidation.validateAsync(
      req.body
    );

    const { token, pin } = req.body;
    let decoded = decodeToken(token);

    if (decoded.data) {
      const dc = JSON.parse(JSON.stringify(decoded.data));
      const activation = await Activations.findOne({ email: dc.email, pin });

      if (activation) {
        // found. now update the status in users and delete from activations
        const user = await Users.findOneAndUpdate(
          { email: dc.email },
          { $set: { status: 'active' } }
        );

        const del = await Activations.deleteMany({ email: dc.email, pin });
        console.log('activations deleted', del);
        if (user) {
          // activation successful
          return res.status(200).json({
            message: 'Account activation successful!',
            status: 'ok',
            code: 200,
          });
        } else {
          // unsuccessful activation
          return res.status(404).json({
            message: 'Could not activate account!',
            status: 'error',
            code: 404,
          });
        }
      } else {
        // activation not found
        return res.status(404).json({
          message:
            'No pending activations with this user and pin. Request one now!',
          status: 'error',
          code: 404,
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: decoded.message, status: 'error', code: 404 });
    }
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: error.message, status: 'error', code: 404 });
  }
};

export {
  Signup,
  Login,
  UsersList,
  MembersList,
  DeleteUser,
  UpdateMember,
  MembersStats,
  ActivateAccount,
};
