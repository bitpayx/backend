import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'bitpayx-app',
  brokers: ['localhost:9094'],
});

export const producer = kafka.producer();
