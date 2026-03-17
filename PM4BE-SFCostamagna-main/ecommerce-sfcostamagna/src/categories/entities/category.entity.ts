import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Products } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'CATEGORIES',
})
export class Categories {
  @ApiProperty({
    description: 'ID único de la categoría (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Teclados',
    maxLength: 50,
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  @ApiHideProperty()
  @Exclude()
  product: Products[];
}
