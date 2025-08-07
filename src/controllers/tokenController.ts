import { Request, Response } from 'express';
import { getBalance, getTotalSupply } from '../services/tokenService';

export const getBalanceHandler = async (req: Request, res: Response) => {
  const { address } = req.params;
  try {
    const balance = await getBalance(address);
    res.json({ address, balance });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTotalSupplyHandler = async (_req: Request, res: Response) => {
  try {
    const totalSupply = await getTotalSupply();
    res.json({ totalSupply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
