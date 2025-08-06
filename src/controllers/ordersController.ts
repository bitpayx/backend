import { Request, Response } from 'express';

export const createOrder = (req: Request, res: Response) => {
  const { amount, userId } = req.body;
  if (!amount || !userId) {
    return res.status(400).json({ error: 'Missing data' });
  }
  return res.status(201).json({ message: 'Order created', orderId: 'xyz123' });
};
