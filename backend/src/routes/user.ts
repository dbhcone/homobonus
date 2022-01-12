import express from 'express';
import { redeemTicket, verifyTicket } from '../controllers/redemption.controller';
import { GetUserDetails, GetUserPurchases, UploadProfilePhoto, UpdateProfile } from '../controllers/user.controller';
import { verifyToken } from '../helpers/functions/auth.helpers';
import { photograph } from '../validators/shared.validations';
const router = express.Router();

router.get('/get-details', verifyToken, GetUserDetails);
router.post('/upload-photo', photograph.single('photo'), UploadProfilePhoto);
router.get('/purchases/:userId', GetUserPurchases);
router.post('/ticket/verify', verifyTicket);
router.post('/ticket/redeem', redeemTicket);
router.patch('/update-profile/:userId', photograph.single('photo'), UpdateProfile);
export { router as userRouter };
