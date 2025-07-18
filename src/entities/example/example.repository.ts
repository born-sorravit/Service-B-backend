import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExampleEntity } from './example.entity';

@Injectable()
export class ExampleRepository extends Repository<ExampleEntity> {
  constructor(private dataSource: DataSource) {
    super(ExampleEntity, dataSource.createEntityManager()); // The second argument is the EntityManager, which can be injected if needed
  }

  // You can add custom methods here for specific queries or operations
  async findByName(name: string): Promise<ExampleEntity[]> {
    return this.find({ where: { name } });
  }

  async findByDescription(description: string): Promise<ExampleEntity[]> {
    return this.find({ where: { description } });
  }
}
