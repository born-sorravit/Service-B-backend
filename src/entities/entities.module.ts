import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleRepository } from './example/example.repository';
import { ExampleEntity } from './example/example.entity';
import { ProductEntity } from './products/product.entity';
import { ProductRepository } from './products/product.repository';

const Entitys = [ExampleEntity, ProductEntity];
const Repositorys = [ExampleRepository, ProductRepository];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([...Entitys])],
  providers: [...Repositorys],
  exports: [...Repositorys],
})
export class EntitiesModule {}
