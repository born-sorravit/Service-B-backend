import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/entities/products/product.repository';
import { BaseService } from 'src/shared/services/base.service';

@Injectable()
export class ProductsService extends BaseService {
  constructor(
    // Repositories
    private readonly productsRepository: ProductRepository,
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
        ])
        .getMany();

      if (!products) {
        return this.error('Products not found', 404);
      }

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
