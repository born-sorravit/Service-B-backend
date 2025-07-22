import { ECurrency } from 'src/enums/currency.enums';
import { DefaultBaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('history')
export class HistoryEntity extends DefaultBaseEntity {
  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  quantity: number;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: false,
  })
  price: string;

  @Column({ type: 'enum', enum: ECurrency, default: ECurrency.USD })
  priceUnit: ECurrency;

  @Column()
  image: string;

  @Column()
  buyer: string;

  @Column()
  seller: string;
}
