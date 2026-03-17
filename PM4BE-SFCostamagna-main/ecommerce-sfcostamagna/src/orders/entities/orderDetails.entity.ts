import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './order.entity';
import { Products } from '../../products/entities/product.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'ORDER_DETAILS',
})
export class OrderDetails {
  @ApiProperty({
    description: 'ID único de la orden (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446651234567',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Precio total con dos decimales',
    example: 1550.99,
    type: 'number',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  // order_id: Relación 1:1 con orders.

  @OneToOne(() => Orders, (order) => order.orderDetails)
  @ApiHideProperty()
  @Exclude()
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  // Relación N:N con products.
  @ApiProperty({
    type: () => [Products],
    description: 'Productos asociados al detalle de la orden',
  })
  @ManyToMany(() => Products)
  @JoinTable({
    name: 'ORDER_DETAILS_PRODUCTS',
    joinColumn: {
      name: 'order_details_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Products[];
}
