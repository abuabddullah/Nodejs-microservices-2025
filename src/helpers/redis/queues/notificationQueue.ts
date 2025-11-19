// src/helpers/queue/notificationQueue.ts

import { Queue, Worker } from 'bullmq';
import { connection } from '../queue.connection';
import { errorLogger } from '../../../shared/logger';

export const notificationQueue = new Queue('notificationQueue', {
     connection,
     defaultJobOptions: {
          attempts: 3,
          backoff: {
               type: 'exponential',
               delay: 3000,
          },
          removeOnComplete: {
               age: 24 * 3600,
               count: 2000,
          },
          removeOnFail: {
               age: 3 * 24 * 3600,
          },
     },
});

// Worker
export const notificationWorker = new Worker(
     'notificationQueue',
     async (job) => {
          const { type, userId, message, data } = job.data;

          console.log('🔔 Processing Notification Job:', job.id, job.data);

          try {
               switch (type) {
                    case 'in-app':
                         // Save notification in DB
                         // Example Notification Model:
                         // await Notification.create({ userId, message, data });
                         console.log('📌 In-app notification saved:', message);
                         break;

                    case 'push':
                         // Push notification service (Expo / FCM)
                         console.log('📢 Push notification sent:', message);
                         break;

                    case 'sms':
                         // SMS provider (Twilio, Fast2SMS)
                         console.log('📱 SMS sent:', message);
                         break;

                    default:
                         throw new Error(`Unknown Notification type: ${type}`);
               }

               return true;
          } catch (err) {
               errorLogger.error('Notification Worker Error:', err);
               throw err;
          }
     },
     {
          connection,
          concurrency: 5,
     },
);

notificationWorker.on('completed', (job) => {
     console.log(`🔔 Notification Job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
     console.error(`❌ Notification Job ${job?.id} failed`, err);
});
