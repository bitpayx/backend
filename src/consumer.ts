import { kafka } from './config/kafka';
import { prisma } from './config/prisma';
import { transferTokens } from './services/tokenService';
import { generateWallet } from './utils/wallet';


const consumer = kafka.consumer({ groupId: 'order-service' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📦 Mensaje recibido:`, {
        key: message.key?.toString(),
        value: message.value?.toString(),
      });
      try {
        const order = JSON.parse(message.value?.toString() || '{}');
        const { userId, amount } = order;

        let wallet = await prisma.wallet.findUnique({ where: { userId } });

        if (!wallet) {
          const newWallet = generateWallet();

          wallet = await prisma.wallet.create({
              data: {
              userId,
              address: newWallet.address,
              // OJO: si guardas privateKey, deberías encriptarla
              },
          });

          console.log(`🆕 Wallet creada para ${userId}: ${wallet.address}`);
        }

        const txHash = await transferTokens(wallet.address, amount);
        console.log(`✅ Transferencia realizada. TX Hash: ${txHash}`);

      } catch (error) {
        console.error('❌ Error al procesar el mensaje:', error);
      }
    },
  });
}

startConsumer();
