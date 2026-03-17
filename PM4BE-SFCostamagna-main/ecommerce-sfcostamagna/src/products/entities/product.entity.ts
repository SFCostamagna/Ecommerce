import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Categories } from '../../categories/entities/category.entity';
import { OrderDetails } from '../../orders/entities/orderDetails.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'PRODUCTS',
})
export class Products {
  @ApiProperty({
    description: ' Debe ser un ID único del producto  (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655412345',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Debe ser un string de máximo 50 caracteres',
    example: 'Teclado J50 Demo',
    maxLength: 50,
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @ApiProperty({
    description: 'Debe ser un string de máximo 50 caracteres',
    example: 'El teclado Demo posee muchas caracteristicas fundamentales',
    maxLength: 50,
  })
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto con dos decimales',
    example: 1299.99,
    type: 'number',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @ApiProperty({
    description:
      'Cantidad de unidades disponibles en inventario (número entero)',
    example: 15,
    type: 'integer',
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @ApiProperty({
    description: 'Url de la imagen del producto',
    example:
      'https://media.losandes.com.ar/p/498f000055321d1bd67eeb22f24945fa/adjuntos/368/imagenes/100/088/0100088915/1000x0/smart/aparatos-electronicos-abandonados-el-hogar-pesar-que-aun-funcionan.jpg',
  })
  @Column({
    type: 'varchar',
    default:
      'https://media.losandes.com.ar/p/498f000055321d1bd67eeb22f24945fa/adjuntos/368/imagenes/100/088/0100088915/1000x0/smart/aparatos-electronicos-abandonados-el-hogar-pesar-que-aun-funcionan.jpg',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Indica si el producto esta activo o no',
    example: 'true',
  })
  @Column({
    default: true,
  })
  isActive: boolean;

  // category_id  (Relación 1:N).
  @ApiProperty({
    type: () => Categories,
    description: 'Categoria asociada al producto',
  })
  @ManyToOne(() => Categories, (category) => category.product)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  // Relación N:N con orderDetails.

  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  @ApiHideProperty()
  @Exclude()
  orderDetails: OrderDetails[];
}
