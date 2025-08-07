import { Router } from 'express';
import {
  getBalanceHandler,
  getTotalSupplyHandler,
  transferHandler
} from '../controllers/tokenController';

const router = Router();

router.get('/:address/balance', getBalanceHandler);
router.get('/total-supply', getTotalSupplyHandler);

router.post('/transfer', transferHandler);

export default router;
