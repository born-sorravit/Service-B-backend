import { DefaultBaseEntity } from 'src/shared/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('example')
export class ExampleEntity extends DefaultBaseEntity {
  @Column()
  name: string;
  @Column()
  description: string;
}
