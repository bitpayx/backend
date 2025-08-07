import { Router } from 'express';
import { getBalanceHandler, getTotalSupplyHandler } from '../controllers/tokenController';

const router = Router();

router.get('/:address/balance', getBalanceHandler);
router.get('/total-supply', getTotalSupplyHandler);

export default router;
