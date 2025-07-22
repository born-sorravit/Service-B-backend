import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { UpdateProductDto } from 'src/modules/common-gateway/products/dto/update-product.dto';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async updateWithTransaction(
    transactionEntityManager: EntityManager,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity | null> {
    await transactionEntityManager.update(ProductEntity, updateProductDto.id, {
      quantity: updateProductDto.quantity,
    });

    return await transactionEntityManager.findOne(ProductEntity, {
      where: { id: updateProductDto.id },
    });
  }
}
