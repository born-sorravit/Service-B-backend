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

@Injectable()
export class WalletsService extends BaseService {
  private readonly urlServiceA: string;
  private readonly apiKeyServiceA: string;
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,

    // Repositories
    private readonly productsRepository: ProductRepository,

    // Services
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.urlServiceA = this.configService.get('urlServiceA');
    this.apiKeyServiceA = this.configService.get('apiKeyServiceA');
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

  async withdraw(walletId: string, withdrawWalletDto: WithdrawWalletDto) {
    try {
      return await this.manager.transaction(
        async (transactionEntityManager) => {
          // update quantity product
          const product = await this.productsRepository.findOne({
            where: { id: withdrawWalletDto.productId },
          });

          if (!product) {
            return this.error('Product not found');
          }

          if (product.quantity < withdrawWalletDto.quantity) {
            return this.error('Product quantity not enough');
          }

          const quantity = product.quantity - withdrawWalletDto.quantity;

          await this.productsRepository.updateWithTransaction(
            transactionEntityManager,
            {
              id: withdrawWalletDto.productId,
              quantity,
            },
          );
          // update quantity product in redis
          const productsCache = await this.cacheService.get(
            CachePrefix.SERVICE,
            CacheGroup.B,
            CacheKey.PRODUCTS,
          );
          let productList: ProductEntity[] = [];

          if (productsCache) {
            productList = JSON.parse(productsCache);

            const index = productList.findIndex(
              (p) => p.id === withdrawWalletDto.productId,
            );

            if (index !== -1) {
              productList[index].quantity = quantity;

              // Add data to redis
              await this.cacheService.set(
                CachePrefix.SERVICE,
                CacheGroup.B,
                CacheKey.PRODUCTS,
                JSON.stringify(productList),
              );
            }
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
            if (!products) {
              return this.error('Products not found', 404);
            }

            // Check cache from redis
            await this.cacheService.set(
              CachePrefix.SERVICE,
              CacheGroup.B,
              CacheKey.PRODUCTS,
              JSON.stringify(products),
            );
          }

          // Call api login จาก service-a
          const response: AxiosResponse<IResponse<any>> = await firstValueFrom(
            this.httpService.post(
              `${this.urlServiceA}/common/wallet/withdraw/${walletId}`,
              {
                ...withdrawWalletDto,
              },
              { headers: { 'x-api-key': this.apiKeyServiceA } },
            ),
          );

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
