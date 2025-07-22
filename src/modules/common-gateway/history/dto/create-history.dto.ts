import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ECurrency } from 'src/enums/currency.enums';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber({ allowNaN: false })
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsEnum(ECurrency)
  @IsNotEmpty()
  priceUnit: ECurrency;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  buyer: string;

  @IsString()
  @IsNotEmpty()
  seller: string;
}
