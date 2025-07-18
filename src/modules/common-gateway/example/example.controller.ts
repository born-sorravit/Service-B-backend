import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  async getExamples() {
    return this.exampleService.findAll();
  }

  @Post()
  async createExample(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }
}
