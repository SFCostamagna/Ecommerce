import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetails } from './orderDetails.entity';
import { Users } from '../../users/entities/user.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
@Entity({
  name: 'ORDERS',
})
export class Orders {
  @ApiProperty({
    description: 'ID único de la orden (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655441245',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description:
      'La fecha de creación de la orden debe tener el formato dd/mm/aaaa',
    example: '20/01/2025',
  })
  @Column()
  date: Date;

  // Relación 1:1 con orderDetails.
  @ApiProperty({
    type: () => OrderDetails,
    description: 'Detalles de la orden (productos, precio total, etc.)',
  })
  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails;

  // user_id:  (Relación 1:N) con users.

  @ManyToOne(() => Users, (user) => user.order)
  @ApiHideProperty()
  @Exclude()
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
