import express from 'express';
import {create, read, readOne, _delete} from '../controllers/purchase.controller';
const router = express.Router();

// purchases
router.post('/', create );
router.get('/', read )
router.get('/:purchaseId', readOne);
router.delete('/:purchaseId', _delete)
export { router as purchasesRouter };
