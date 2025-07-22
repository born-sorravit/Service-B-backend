import { Controller, Post, Body, Param, Get, Headers } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WithdrawWalletDto } from './dto/withdraw-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('/:walletId')
  async getWallet(@Param('walletId') walletId: string) {
    return this.walletsService.getWallet(walletId);
  }

  @Post('/withdraw/:walletId')
  async withdraw(
    @Param('walletId') walletId: string,
    @Body() withdrawWalletDto: WithdrawWalletDto,
    @Headers() headers: Record<string, string>,
  ) {
    const apiKey = headers['x-api-key'];
    return this.walletsService.withdraw(walletId, withdrawWalletDto, apiKey);
  }
}
