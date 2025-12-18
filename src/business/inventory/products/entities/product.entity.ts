import { Category } from 'src/business/inventory/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: false, unique: true })
  code: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  purchase_price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  selling_price: number;

  @ManyToOne(() => Category, (category) => category.category_name, {
    eager: true,
  })
  category: Category;

  @Column()
  stock: number;
}
