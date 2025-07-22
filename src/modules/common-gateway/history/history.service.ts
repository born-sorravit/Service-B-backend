import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { HistoryRepository } from 'src/entities/history/history.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class HistoryService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,

    // Repositories
    private readonly historyRepository: HistoryRepository,
  ) {
    super();
  }

  async findAll(username: string) {
    try {
      const history = await this.historyRepository
        .createQueryBuilder('history')
        .select([
          'history.id',
          'history.productId',
          'history.productName',
          'history.quantity',
          'history.price',
          'history.priceUnit',
          'history.image',
          'history.buyer',
          'history.seller',
          'history.createdAt',
        ])
        .where('history.buyer = :buyer', { buyer: username })
        .getMany();

      if (!history) {
        return this.error('History not found', 404);
      }
      return this.success(history);
    } catch (error) {
      return this.error('Failed to retrieve history', error.message);
    }
  }
}
