import { Injectable } from '@nestjs/common';
import { ExampleRepository } from 'src/entities/example/example.repository';
import { BaseService } from 'src/shared/services/base.service';
import { CreateExampleDto } from './dto/create-example.dto';

@Injectable()
export class ExampleService extends BaseService {
  constructor(private readonly exampleRepository: ExampleRepository) {
    super();
  }

  async findAll() {
    try {
      const examples = await this.exampleRepository.find();
      return this.success(examples);
    } catch (error) {
      return this.error('Failed to retrieve examples', error.message);
    }
  }

  async create(createExampleDto: CreateExampleDto) {
    try {
      const example = this.exampleRepository.create(createExampleDto);

      await this.exampleRepository.save(example);
      return this.success(example);
    } catch (error) {
      return this.error('Failed to create example', error.message);
    }
  }
}
