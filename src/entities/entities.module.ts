import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleRepository } from './example/example.repository';
import { ExampleEntity } from './example/example.entity';
import { ProductEntity } from './products/product.entity';
import { ProductRepository } from './products/product.repository';
import { HistoryEntity } from './history/history.entity';
import { HistoryRepository } from './history/history.repository';

const Entitys = [ExampleEntity, ProductEntity, HistoryEntity];
const Repositorys = [ExampleRepository, ProductRepository, HistoryRepository];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([...Entitys])],
  providers: [...Repositorys],
  exports: [...Repositorys],
})
export class EntitiesModule {}
