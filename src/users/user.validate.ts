import { BadRequestException } from '@nestjs/common';

export function validateUser(user: any) {
  if (!user.name || typeof user.name !== 'string') {
    throw new BadRequestException(
      'El nombre es obligatorio y debe ser un texto',
    );
  }

  if (
    !user.email ||
    typeof user.email !== 'string' ||
    !user.email.includes('@')
  ) {
    throw new BadRequestException(
      'El email es obligatorio y debe tener un formato válido',
    );
  }

  if (!user.password || typeof user.password !== 'string') {
    throw new BadRequestException(
      'La contraseña es obligatoria y debe ser un texto',
    );
  }

  if (!user.address || typeof user.address !== 'string') {
    throw new BadRequestException(
      'La dirección es obligatoria y debe ser un texto',
    );
  }

  if (!user.phone || typeof user.phone !== 'number') {
    throw new BadRequestException(
      'El teléfono es obligatorio y debe ser un numero',
    );
  }
}

export function validateUserUpdate(user: any) {
  if (user.name && typeof user.name !== 'string') {
    throw new BadRequestException('El nombre debe ser un texto');
  }

  if (
    user.email &&
    (typeof user.email !== 'string' || !user.email.includes('@'))
  ) {
    throw new BadRequestException('El formato del email es inválido');
  }

  if (user.password && typeof user.password !== 'string') {
    throw new BadRequestException('La contraseña debe ser un texto');
  }

  if (user.address && typeof user.address !== 'string') {
    throw new BadRequestException('La dirección debe ser un texto');
  }

  if (user.phone && typeof user.phone !== 'number') {
    throw new BadRequestException('El teléfono debe ser un numero');
  }
}
