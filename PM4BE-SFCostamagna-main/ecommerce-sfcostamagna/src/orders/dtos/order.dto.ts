import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class productOrderDto {
  @ApiProperty({
    description: 'ID del producto (UUID v4)',
    example: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  })
  @IsNotEmpty()
  @IsUUID(4)
  id: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la compra',
    example: '8d8ac610-566d-4ef0-9c22-186b2a5ed793',
  })
  @IsNotEmpty()
  @IsUUID(4)
  user_id: string;

  @ApiProperty({
    type: [productOrderDto], // <-- ESTO es lo que le dice a Swagger que es un array de objetos
    description: 'Lista de productos a comprar',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => productOrderDto)
  products: productOrderDto[];
}
