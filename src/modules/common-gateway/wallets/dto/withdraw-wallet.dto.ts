import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ECurrency } from 'src/enums/currency.enums';

export class WithdrawWalletDto extends PartialType(CreateWalletDto) {
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'amount must have at most 2 decimal places' },
  )
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsEnum(ECurrency)
  @IsNotEmpty()
  currency: ECurrency;

  @IsString()
  @IsNotEmpty()
  toUsername: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  @Min(1)
  quantity: number;
}
