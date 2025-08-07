import { Router } from 'express';
import { getWalletByUserId } from '../controllers/userController';

const router = Router();
router.get('/:userId/wallet', getWalletByUserId);
export default router;



