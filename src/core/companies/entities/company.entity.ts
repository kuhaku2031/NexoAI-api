import { PointSale } from 'src/business/pos/point-sale/entities/point-sale.entity';
import { WorkSession } from 'src/business/work-sessions/entities/work-session.entity';
import { Users } from 'src/core/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryColumn()
  company_id: string;

  @Column()
  company_name: string;

  @Column()
  business_type: string;

  @Column()
  email: string;

  @Column()
  phone_number: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @OneToMany(() => Users, (users) => users.company)
  users: Users;

  @OneToMany(() => PointSale, (pointSale) => pointSale.company)
  point_sales: PointSale;

  @OneToMany(() => WorkSession, (workSession) => workSession.company)
  work_sessions: WorkSession;
}
