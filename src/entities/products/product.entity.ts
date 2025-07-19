import { ECurrency } from 'src/enums/currency.enums';
import { DefaultBaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class ProductEntity extends DefaultBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

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
  quantity: number;

  @Column()
  image: string;

  @Column({
    name: 'user_id',
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'created_by_username',
    nullable: false,
  })
  createdByUsername: string;
}
