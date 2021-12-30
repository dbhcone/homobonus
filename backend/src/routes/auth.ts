import express from 'express';
import { Signup, Login, ActivateAccount, AccountList } from '../controllers/auth.controller';
const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/activate-account', ActivateAccount);
router.get('/users', AccountList);
// router.post('/deleteUser', DeleteUser);
// router.post('/updateMember', UpdateMember);
// router.get('/membersstats', MembersStats);
export { router as authRouter };
