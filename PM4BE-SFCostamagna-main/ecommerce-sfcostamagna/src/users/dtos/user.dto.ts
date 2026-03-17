import {
  ApiProperty,
  ApiHideProperty,
  PartialType,
  OmitType,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { MatchPassword } from '../../common/decorators/matchPassword.decorator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario (3 a 80 caracteres)',
    example: 'Nombre Demo',
  })
  @IsNotEmpty({ message: 'Nombre no puede estar vacío' })
  @IsString({ message: 'Nombre debe ser un string' })
  @MinLength(3, { message: 'Nombre debe ser de al menos 3 caracteres' })
  @MaxLength(80, { message: 'Nombre debe ser como máximo de 80 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico válido',
    example: 'demo@mail.com',
  })
  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @ApiProperty({
    description:
      'Contraseña fuerte: 1 minúscula, 1 mayúscula, 1 número, 1 símbolo (8-15 caracteres)',
    example: 'Contraseña.Dem1',
  })
  @IsNotEmpty({ message: 'Contraseña no puede estar vacía' })
  @IsString({ message: 'Contraseña debe ser válida' })
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Debe contener al menos una minúscula, una mayúscula, un número y un caracter especial',
    },
  )
  @MinLength(8, { message: 'Contraseña debe ser de al menos 8 caracteres' })
  @MaxLength(15, {
    message: 'Contraseña debe ser como máximo de 15 caracteres',
  })
  password: string;

  @ApiProperty({
    description: 'Debe coincidir con la contraseña',
    example: 'Contraseña.Dem1',
  })
  @IsNotEmpty() //"parámetro de configuración" para tu validador. son recibidos en args.constraints
  @Validate(MatchPassword, ['password'])
  confirmPassword: string;

  @ApiProperty({
    description: 'Dirección física del usuario (3 a 80 caracteres)',
    example: 'Direccion Demo 24',
  })
  @IsString({ message: 'Dirección debe ser un string' })
  @MinLength(3, { message: 'Dirección debe ser de al menos 3 caracteres' })
  @MaxLength(80, { message: 'Dirección debe ser como máximo de 80 caracteres' })
  address: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: 123456789,
  })
  @IsNotEmpty({ message: 'Teléfono no puede estar vacío' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Teléfono debe ser un número' },
  )
  phone: number;

  @ApiProperty({
    description: 'País de residencia (5 a 20 caracteres)',
    example: 'Argentina',
  })
  @IsString({ message: 'País debe ser un string' })
  @MinLength(5, { message: 'País debe ser de al menos 5 caracteres' })
  @MaxLength(20, { message: 'País debe ser como máximo de 20 caracteres' })
  country: string;

  @ApiProperty({
    description: 'Ciudad de residencia (5 a 20 caracteres)',
    example: 'Buenos Aires',
  })
  @IsString({ message: 'Ciudad debe ser un string' })
  @MinLength(5, { message: 'Ciudad debe ser de al menos 5 caracteres' })
  @MaxLength(20, { message: 'Ciudad debe ser como máximo de 20 caracteres' })
  city: string;

  @ApiHideProperty()
  @IsEmpty()
  isAdmin: boolean;

  @ApiHideProperty()
  @IsEmpty()
  isActive: boolean;
}

export class updateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {}

export class LoginUserDto {
  @ApiProperty({ example: 'demo@mail.com' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'Email debe ser válido' })
  email: string;

  @ApiProperty({ example: 'Contraseña.Dem1' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString()
  password: string;
}
