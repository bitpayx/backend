import { kafka } from './config/kafka';

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
    },
  });
}

startConsumer();
