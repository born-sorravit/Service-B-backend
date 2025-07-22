import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { HistoryEntity } from './history.entity';
import { CreateHistoryDto } from 'src/modules/common-gateway/history/dto/create-history.dto';

@Injectable()
export class HistoryRepository extends Repository<HistoryEntity> {
  constructor(private dataSource: DataSource) {
    super(HistoryEntity, dataSource.createEntityManager());
  }

  async createWithTransaction(
    transactionEntityManager: EntityManager,
    createHistoryDtos: CreateHistoryDto,
  ): Promise<HistoryEntity> {
    const historyEntities = transactionEntityManager.create(
      HistoryEntity,
      createHistoryDtos,
    );

    return await transactionEntityManager.save(HistoryEntity, historyEntities);
  }
}
