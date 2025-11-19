// src/helpers/queue/emailQueue.ts
import { Queue, Worker } from 'bullmq';
import { connection } from '../queue.connection';
import { errorLogger } from '../../../shared/logger';
import { emailHelper } from '../../emailHelper';

export const emailQueue = new Queue('emailQueue', {
     connection,
     defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 3000 },
          removeOnComplete: { age: 24 * 3600, count: 2000 },
          removeOnFail: { age: 3 * 24 * 3600 },
     },
});

// Worker
export const emailWorker = new Worker(
     'emailQueue',
     async (job) => {
          try {
               console.log('📧 Processing email job:', job.id);

               const { template, to, subject } = job.data;

               await emailHelper.sendEmail({
                    to,
                    subject,
                    html: template,
               });

               return true;
          } catch (err) {
               errorLogger.error('Email queue worker error:', err);
               throw err;
          }
     },
     { connection, concurrency: 5 },
);

emailWorker.on('completed', (job) => {
     console.log(`📨 Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
     console.error(`❌ Email job ${job?.id} failed:`, err);
});
