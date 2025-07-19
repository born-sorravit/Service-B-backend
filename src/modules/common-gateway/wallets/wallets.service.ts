import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { BaseService } from 'src/shared/services/base.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';
import { firstValueFrom } from 'rxjs';
import { ProductRepository } from 'src/entities/products/product.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class WalletsService extends BaseService {
  private readonly urlServiceA: string;

  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,

    // Repositories
    private readonly productsRepository: ProductRepository,

    // Services
    private readonly httpService: HttpService,
  ) {
    super();
    this.urlServiceA = process.env.URL_SERVICE_A;
  }

  async withdraw(walletId: string, withdrawWalletDto: WithdrawWalletDto) {
    try {
      return await this.manager.transaction(
        async (transactionEntityManager) => {
          // TODO : update quantity product
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

          // Call api login จาก service-a
          const response: AxiosResponse<IResponse<any>> = await firstValueFrom(
            this.httpService.post(
              `${this.urlServiceA}/common/wallet/withdraw/${walletId}`,
              {
                ...withdrawWalletDto,
              },
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
      return this.error('Failed to login', error.message);
    }
  }
}
