import { Router } from 'express';
import { createOrder } from '../controllers/ordersController';

const router = Router();
router.post('/', createOrder);
export default router;
