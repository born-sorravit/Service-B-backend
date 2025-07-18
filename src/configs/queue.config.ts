/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

// Define the queue configuration
// The connection object is the same as the connection object of the Redis module
// The defaultJobOptions object is the default options for all jobs
// delay: delay in 3 seconds before processing the job
// removeOnComplete: collect last completed 1000 jobs
// removeOnFail: collect last failed 1000 jobs
// attempts: retry 3 times before fail

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
export const queueConfig = BullModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    connection: {
      host: configService.get('redis.host'),
      port: configService.get('redis.port'),
      password: configService.get('redis.password'),
    },
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 1000,
      attempts: 3,
    },
  }),
});
