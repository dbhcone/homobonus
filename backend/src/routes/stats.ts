import express from 'express';
import { generalOverview, portalStats } from '../controllers/statistics.controller';
const router = express.Router();

router.get('/generaloverview', generalOverview);
router.get('/eventportal/:eventId', portalStats)

export { router as statsRouter };
