import express from 'express';
import { paymentOptions } from '../controllers/payment.controller';
const router = express.Router();

// purchases
router.post('/listPaymentOptions', paymentOptions);
// router.get('/', read )
// router.get('/:purchaseId', readOne);
// router.delete('/:purchaseId', _delete)
export { router as paymentsRouter };
