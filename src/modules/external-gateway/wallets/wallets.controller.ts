import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
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
  ) {
    return this.walletsService.withdraw(walletId, withdrawWalletDto);
  }
}
