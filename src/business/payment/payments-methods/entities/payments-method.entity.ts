import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentsMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method_name: string;
}
