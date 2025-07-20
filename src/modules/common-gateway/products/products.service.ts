import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/entities/products/product.repository';
import { BaseService } from 'src/shared/services/base.service';
import { QueuesService } from '../queues/queues.service';
import { CacheService } from 'src/shared/services/cache.service';
import {
  CacheGroup,
  CacheKey,
  CachePrefix,
} from 'src/constants/cache-prefix.constant';

@Injectable()
export class ProductsService extends BaseService {
  constructor(
    // Repositories
    private readonly productsRepository: ProductRepository,

    //  Services
    private readonly queuesService: QueuesService,
    private readonly cacheService: CacheService,
  ) {
    super();
  }
  async findAll() {
    try {
      const products = await this.productsRepository
        .createQueryBuilder('products')
        .select([
          'products.id',
          'products.image',
          'products.name',
          'products.description',
          'products.price',
          'products.priceUnit',
          'products.quantity',
          'products.userId',
          'products.createdByUsername',
        ])
        .getMany();

      if (!products) {
        return this.error('Products not found', 404);
      }

      // Check cache from redis
      const productsCache = await this.cacheService.get(
        CachePrefix.SERVICE,
        CacheGroup.B,
        CacheKey.PRODUCTS,
      );

      if (productsCache) {
        console.log('data from redis');
        return this.success(JSON.parse(productsCache));
      }

      // Add data to redis
      await this.cacheService.set(
        CachePrefix.SERVICE,
        CacheGroup.B,
        CacheKey.PRODUCTS,
        JSON.stringify(products),
      );

      console.log('data from db');
      return this.success(products);
    } catch (error) {
      return this.error('Failed to retrieve products', error.message);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productsRepository
        .createQueryBuilder('products')
        .select([
          'products.id',
          'products.image',
          'products.name',
          'products.description',
          'products.price',
          'products.priceUnit',
          'products.quantity',
        ])
        .where('products.id = :id', { id })
        .getOne();

      if (!product) {
        return this.error('Product not found', 404);
      }

      return this.success(product);
    } catch (error) {
      return this.error('Failed to retrieve product', error.message);
    }
  }
}
