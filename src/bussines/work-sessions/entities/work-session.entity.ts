import { Company } from 'src/core/companies/entities/company.entity';

import { Users } from 'src/core/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from 'src/common/enum/status.enum';

@Entity()
export class WorkSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.work_sessions)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // @ManyToOne(() => PointSale, (pointSale) => pointSale.work_sessions)
  // @JoinColumn({ name: 'point_sale_id' })
  // point_sale: PointSale;

  @ManyToOne(() => Users, (users) => users.work_sessions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column()
  check_in: string;

  @Column({ nullable: true })
  check_out: string;

  @Column({ type: 'enum', enum: Status, default: Status.INACTIVE })
  status: Status;

  @Column()
  total_time: number;
}
