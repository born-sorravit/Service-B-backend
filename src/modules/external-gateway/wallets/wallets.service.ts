import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';
import { firstValueFrom } from 'rxjs';
import { ProductRepository } from 'src/entities/products/product.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  CacheGroup,
  CacheKey,
  CachePrefix,
} from 'src/constants/cache-prefix.constant';
import { CacheService } from 'src/shared/services/cache.service';
import { ProductEntity } from 'src/entities/products/product.entity';
import { ConfigService } from '@nestjs/config';
import { IWalletResponse } from 'src/interfaces/wallet.interface';
import { HistoryRepository } from 'src/entities/history/history.repository';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class WalletsService extends BaseService {
  private readonly urlServiceA: string;
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,

    // Repositories
    private readonly productsRepository: ProductRepository,
    private readonly historyRepository: HistoryRepository,
    // Services
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.urlServiceA = this.configService.get('urlServiceA');
  }

  async getWallet(walletId: string) {
    try {
      // Call api login จาก service-a
      const response: AxiosResponse<IResponse<IWalletResponse>> =
        await firstValueFrom(
          this.httpService.get(`${this.urlServiceA}/common/wallet/${walletId}`),
        );

      if (!response.data.data) {
        return this.error(`Can't get wallet`);
      }

      return this.success({ ...response.data.data });
    } catch (error) {
      return this.error('Failed to get wallet', error.message);
    }
  }

  async withdraw(
    walletId: string,
    withdrawWalletDto: WithdrawWalletDto,
    apiKey: string,
  ) {
    try {
      return await this.manager.transaction(
        async (transactionEntityManager) => {
          const updatedProducts: ProductEntity[] = [];

          const productIds = withdrawWalletDto.products.map((p) => p.id);
          const dbProducts = await this.productsRepository.findByIds(
            productIds,
          );
          const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

          for (const item of withdrawWalletDto.products) {
            const product = dbProductMap.get(item.id);
            if (!product) {
              return this.error(`Product not found: ${item.id}`);
            }

            if (product.quantity < item.quantity) {
              return this.error(`Product quantity not enough: ${product.name}`);
            }

            const newQuantity = product.quantity - item.quantity;

            await this.productsRepository.updateWithTransaction(
              transactionEntityManager,
              {
                id: item.id,
                quantity: newQuantity,
              },
            );

            // เก็บไว้สำหรับ update cache ใน redis
            product.quantity = newQuantity;
            updatedProducts.push(product);
          }

          const productsCache = await this.cacheService.get(
            CachePrefix.SERVICE,
            CacheGroup.B,
            CacheKey.PRODUCTS,
          );

          let productList: ProductEntity[] = [];

          if (productsCache) {
            productList = JSON.parse(productsCache);

            for (const updatedProduct of updatedProducts) {
              const product = productList.find(
                (p) => p.id === updatedProduct.id,
              );

              if (!product) continue;

              product.quantity = updatedProduct.quantity;
              console.log({ product });

              const totalPrice =
                withdrawWalletDto.products.find((p) => p.id === product.id)
                  .quantity * Number(product.price);

              const quantity = withdrawWalletDto.products.find(
                (p) => p.id === product.id,
              ).quantity;

              await this.historyRepository.createWithTransaction(
                transactionEntityManager,
                {
                  productId: product.id,
                  productName: product.name,
                  quantity: quantity,
                  price: totalPrice.toString(),
                  priceUnit: product.priceUnit,
                  image: product.image,
                  buyer: withdrawWalletDto.username,
                  seller: product.createdByUsername,
                },
              );
            }

            await this.cacheService.set(
              CachePrefix.SERVICE,
              CacheGroup.B,
              CacheKey.PRODUCTS,
              JSON.stringify(productList),
            );
          } else {
            const products = await transactionEntityManager
              .createQueryBuilder(ProductEntity, 'products')
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

            await this.cacheService.set(
              CachePrefix.SERVICE,
              CacheGroup.B,
              CacheKey.PRODUCTS,
              JSON.stringify(products),
            );
          }
          // Call api withdraw จาก service-a
          const response: AxiosResponse<IResponse<any>> = await firstValueFrom(
            this.httpService.post(
              `${this.urlServiceA}/common/wallet/withdraw-external/${walletId}`,
              withdrawWalletDto,
              { headers: { 'x-api-key': apiKey } },
            ),
          );

          console.log({
            toUser: withdrawWalletDto.toUsers,
            product: withdrawWalletDto.products,
          });

          if (!response.data.data) {
            return this.error(`Can't withdraw`);
          }

          return this.success({
            message: 'Withdraw success',
            ...response.data.data,
          });
        },
      );
    } catch (error) {
      return this.error('Failed to withdraw', error.message);
    }
  }
}
