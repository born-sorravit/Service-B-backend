import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ECurrency } from 'src/enums/currency.enums';

export class WithdrawWalletDto extends PartialType(CreateWalletDto) {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsArray()
  @IsNotEmpty()
  toUsers: {
    amount: number;
    currency: ECurrency;
    username: string;
  }[];

  @IsArray()
  @IsNotEmpty()
  products: {
    id: string;
    quantity: number;
    toUsername: string;
  }[];
}
