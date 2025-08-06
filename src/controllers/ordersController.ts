import { Request, Response } from 'express';
import { createOrderService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response) => {
  const { amount, userId, idempotencyKey } = req.body;

  if (!amount || !userId || !idempotencyKey) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    const order = await createOrderService({
      amount: parseFloat(amount),
      userId,
      idempotencyKey,
    });
    return res.status(201).json(order);
  } catch (err: any) {
    const error = err?.message === 'Order already in process' ? 409 : 500;
    return res.status(error).json({ error: err.message || 'Internal server error' });
  }
};
