import { Job } from 'bullmq';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { QueuesService } from './queues.service';

@Processor('jobs-service-b')
export class JobsProcessor extends WorkerHost {
  private readonly coreServiceUrl: string;

  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,

    // Services
    private readonly queuesService: QueuesService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    super();
    this.coreServiceUrl = this.configService.get('coreService.url');
  }
  private readonly logger = new Logger(JobsProcessor.name);

  onScheduledProject(job: Job) {
    console.log('Processing project job:', job.id, job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`✅ Job ${job.id} completed successfully!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`❌ Job ${job?.id} failed:`, err);
  }

  @OnWorkerEvent('paused')
  onPaused() {
    console.log('Worker paused');
  }

  @OnWorkerEvent('resumed')
  onResumed() {
    console.log('Worker resumed');
  }

  async process(job: Job) {
    try {
      if (job.name === 'projects-task') {
        this.onScheduledProject(job);
      }
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      throw new Error(error.message as string);
    }
  }
}
