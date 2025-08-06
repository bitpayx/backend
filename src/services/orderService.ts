import { prisma } from '../config/prisma';
import { redis } from '../config/redis';
import { producer } from '../config/kafka';

interface OrderInput {
  userId: string;
  amount: number;
  idempotencyKey: string;
}

export const createOrderService = async ({ userId, amount, idempotencyKey }: OrderInput) => {
  const key = `idempotency:${idempotencyKey}`;
  const exists = await redis.get(key);
  if (exists) throw new Error('Order already in process');

  await redis.set(key, 'processing', 'EX', 60);

  try {
    const order = await prisma.order.create({
      data: { userId, amount, idempotencyKey },
    });

    await producer.send({
      topic: 'order.created',
      messages: [
        {
          key: String(order.id),
          value: JSON.stringify(order),
        },
      ],
    });

    await redis.del(key);
    return order;
  } catch (error) {
    await redis.del(key);
    throw error;
  }
};
