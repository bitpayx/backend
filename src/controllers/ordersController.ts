import { Request, Response } from 'express';
import { pool } from '../config/db';
import { redis } from '../config/redis';
import { QueryResult } from 'pg';

export const createOrder = async (req: Request, res: Response) => {
  const { amount, userId, idempotencyKey } = req.body;
  if (!amount || !userId) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const key = `idempotency:${idempotencyKey}`;
  const exists = await redis.get(key);

  if (exists) {
    return res.status(409).json({ error: 'Order already in process' });
  }

  await redis.set(key, 'processing', 'EX', 60);

  try {
    const result: QueryResult = await pool.query(
      'INSERT INTO orders (user_id, amount, idempotency_key) VALUES ($1, $2, $3) RETURNING *',
      [userId, amount, idempotencyKey]
    );
    await redis.del(key);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('DB error:', error);
    await redis.del(key);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
