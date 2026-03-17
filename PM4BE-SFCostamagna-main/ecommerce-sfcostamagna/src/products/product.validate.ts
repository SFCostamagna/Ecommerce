import { BadRequestException } from '@nestjs/common';

export function validateProduct(product: any) {
  if (!product.name || typeof product.name !== 'string') {
    throw new BadRequestException(
      'El nombre es obligatorio y debe ser un texto',
    );
  }

  if (!product.description || typeof product.description !== 'string') {
    throw new BadRequestException(
      'La descripción es obligatoria y debe ser un texto',
    );
  }

  if (product.price === undefined || typeof product.price !== 'number') {
    throw new BadRequestException(
      'El precio es obligatorio y debe ser un número',
    );
  }

  if (product.stock === undefined || typeof product.stock !== 'boolean') {
    throw new BadRequestException(
      'El stock es obligatorio y debe ser un valor booleano (true/false)',
    );
  }

  if (!product.imgUrl || typeof product.imgUrl !== 'string') {
    throw new BadRequestException(
      'La URL de la imagen es obligatoria y debe ser un texto',
    );
  }
}

export function validateProductUpdate(product: any) {
  if (product.name && typeof product.name !== 'string') {
    throw new BadRequestException('El nombre debe ser un texto');
  }

  if (product.description && typeof product.description !== 'string') {
    throw new BadRequestException('La descripción debe ser un texto');
  }

  if (product.price !== undefined && typeof product.price !== 'number') {
    throw new BadRequestException('El precio debe ser un número');
  }

  if (product.stock !== undefined && typeof product.stock !== 'boolean') {
    throw new BadRequestException('El stock debe ser un booleano (true/false)');
  }

  if (product.imgUrl && typeof product.imgUrl !== 'string') {
    throw new BadRequestException('La URL de la imagen debe ser un texto');
  }
}
