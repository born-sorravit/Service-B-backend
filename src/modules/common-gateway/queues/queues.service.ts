import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { ProductEntity } from 'src/entities/products/product.entity';
import { BaseService } from 'src/shared/services/base.service';

@Injectable()
export class QueuesService extends BaseService {
  constructor(
    @InjectQueue('jobs-service-b') private readonly JobsProjectsQueue: Queue,
  ) {
    super();
  }

  async addJobProducts(data: ProductEntity[], delay: number) {
    try {
      const res = await this.JobsProjectsQueue.add(
        'products-task',
        data,
        { removeOnComplete: true, removeOnFail: true, delay: delay }, // BullMQ expects delay in milliseconds
      );
      console.log(`Job scheduled to run in ${delay / 1000} seconds ⏰`);
      return this.success(res);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllJobs() {
    const jobs = (await this.JobsProjectsQueue.getJobs()) as Job[];
    for (const job of jobs) {
      if (job.id) {
        console.log(job.id);
        await job.moveToWaitingChildren(job.id); // Fixed by adding job.id as argument
      }
    }
    return jobs;
  }

  async pauseJob(id: string) {
    const job = (await this.JobsProjectsQueue.getJob(id)) as Job;

    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    if (job.id) {
      await job.moveToWaitingChildren(job.id); // Fixed by adding job.id as argument
    }
    return `Job ${id} paused`;
  }

  async resumeJob(id: string) {
    const job = (await this.JobsProjectsQueue.getJob(id)) as Job;
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    const delay = job.delay;
    console.log({ delay });
    await job.changeDelay(0);
    return `Job ${id} resumed`;
  }

  async removeJob(id: string) {
    try {
      const job = (await this.JobsProjectsQueue.getJob(id)) as Job;

      if (!job) {
        throw new Error(`Job with ID ${id} not found`);
      }

      await job.remove();

      return this.success({ message: `Job ${id} removed successfully` });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
