import express from 'express';
import { GetUserDetails, GetUserPurchases, UploadProfilePhoto } from '../controllers/user.controller';
import { photograph } from '../validators/shared.validations';
const router = express.Router();

router.post('/', GetUserDetails);
router.post('/upload-photo', photograph.single('photo'), UploadProfilePhoto);
router.get('/purchases/:userId', GetUserPurchases)
export { router as userRouter };
