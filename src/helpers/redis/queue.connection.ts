// src/helpers/queue/queue.connection.ts
import { redisConfig } from './redis';

export const connection = {
     ...redisConfig,
     maxRetriesPerRequest: null,
     enableReadyCheck: false,
};
