import { Product } from 'src/business/inventory/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  category_name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
