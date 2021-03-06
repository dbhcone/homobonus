import express from 'express';
import {
    Signup,
    Login,
    ActivateAccount,
    AccountList,
    DeleteUser,
    ResetPassword,
    RequestPasswordReset,
    MerchantSignup
} from '../controllers/auth.controller';
import { verifyToken } from '../helpers/functions/auth.helpers';
const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/activate-account', verifyToken, ActivateAccount);
router.get('/users', verifyToken, AccountList);
router.post('/deleteUser', DeleteUser);
router.post('/reset-password', ResetPassword);
router.post('/forgot-password', RequestPasswordReset);
router.post('/merchant-signup', MerchantSignup);
// router.post('/updateMember', UpdateMember);
// router.get('/membersstats', MembersStats);
export { router as authRouter };
