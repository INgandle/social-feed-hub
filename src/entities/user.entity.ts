import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity()
export class User extends BaseModel {
  @Column({ type: 'varchar', length: 32, unique: true })
  accountName: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;
}
