import express from 'express';
import { read, create } from '../controllers/confirmation.controller';
const router = express.Router();

// purchases
router.post('/', create);
router.get('/', read);
// router.get('/:confirmationId', readOne);
// router.delete('/:confirmationId', _delete)
export { router as confirmationsRouter };
