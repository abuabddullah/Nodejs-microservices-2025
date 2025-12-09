import { Kafka } from 'kafkajs';

const kafka = new Kafka({
     clientId: 'media-service',
     brokers: ['localhost:9092'],
     logLevel: 1,
});

export default kafka;
