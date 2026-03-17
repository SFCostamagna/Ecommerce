import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Orders } from '../../orders/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'USERS',
})
export class Users {
  @ApiProperty({
    description: 'ID único de la orden (UUID v4)',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario, máximo 50 caracteres',
    example: 'Demo Usuario',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'email valido para iniciar sesión',
    example: 'demo@mail.com',
  })
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiHideProperty() // <-- Esto evita que Swagger lo muestre en los ejemplos de respuesta
  @Exclude() // <-- Esto evita que NestJS lo envíe en el JSON real
  @Column({
    type: 'varchar',
    length: 60, //para el hasheo
    nullable: false,
  })
  password: string;

  @ApiProperty({
    description: 'Número de teléfono de contacto',
    example: 123456789,
  })
  @Column({
    type: 'int',
  })
  phone: number;

  @ApiProperty({
    description:
      'Debe  ser un string entre 5 y 20 del pais de residencia del usuario',
    example: 'Pais demo',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  country: string;

  @ApiProperty({
    description: 'Debe  ser un texto de la direccion del usuario',
    example: 'Direccion Demo 24',
  })
  @Column({
    type: 'text',
  })
  address: string;

  @ApiProperty({
    description:
      'Debe  ser un string de la ciudad de residencia de maximo 50 caracteres',
    example: 'Ciudad Demo',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  city: string;

  @ApiHideProperty()
  @Exclude()
  @Column({
    default: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Estado de la cuenta del usuario',
    example: true,
  })
  @Column({
    default: true,
  })
  isActive: boolean;

  // orders_id: Relación 1:N con orders.
  @OneToMany(() => Orders, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  order: Orders[];
}
