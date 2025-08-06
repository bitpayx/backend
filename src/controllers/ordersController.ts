import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createOrder = async (req: Request, res: Response) => {
  const { amount, userId } = req.body;
  if (!amount || !userId) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, amount) VALUES ($1, $2) RETURNING *',
      [userId, amount]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('DB error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
