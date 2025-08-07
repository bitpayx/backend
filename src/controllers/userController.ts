import { prisma } from '../config/prisma';
import { Request, Response } from 'express';

export const getWalletByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  res.json(wallet);
};