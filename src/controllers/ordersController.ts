import { Request, Response } from 'express';
import { redis } from '../config/redis';
import { prisma } from '../config/prisma';

export const createOrder = async (req: Request, res: Response) => {
  const { amount, userId, idempotencyKey } = req.body;
  if (!amount || !userId || !idempotencyKey) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const key = `idempotency:${idempotencyKey}`;
  const exists = await redis.get(key);

  if (exists) {
    return res.status(409).json({ error: 'Order already in process' });
  }

  await redis.set(key, 'processing', 'EX', 60);

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        amount: parseFloat(amount),
        idempotencyKey
      },
    });
    await redis.del(key);
    return res.status(201).json(order);
  } catch (error) {
    await redis.del(key);
    console.error('DB error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
