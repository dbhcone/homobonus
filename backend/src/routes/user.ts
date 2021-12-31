import express from 'express';
import { redeemTicket, verifyTicket } from '../controllers/redemption.controller';
import { GetUserDetails, GetUserPurchases, UploadProfilePhoto } from '../controllers/user.controller';
import { photograph } from '../validators/shared.validations';
const router = express.Router();

router.post('/', GetUserDetails);
router.post('/upload-photo', photograph.single('photo'), UploadProfilePhoto);
router.get('/purchases/:userId', GetUserPurchases);
router.post('/ticket/verify', verifyTicket);
router.post('/ticket/redeem', redeemTicket);
export { router as userRouter };
