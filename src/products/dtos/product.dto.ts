import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Teclado actualizado RGB',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener como maximo 3 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto actualizado',
    example: 'Teclado con teclas con luces',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'La descripción debe ser más detallada' })
  description: string;

  @ApiProperty({
    description: 'Precio del producto actualizado',
    example: 1500.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'El precio debe ser mayor a 0' })
  price: number;

  @ApiProperty({ description: 'Stock disponible actualizado', example: 20 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @ApiProperty({
    description: 'URL de la imagen actualizada',
    example: 'https://foto.com/imagen.jpg',
  })
  @IsNotEmpty()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  imgUrl?: string;

  @ApiProperty({
    description: 'Estado inicial',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
