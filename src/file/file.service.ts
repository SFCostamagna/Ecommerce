import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileRepository } from './file.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}
  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.productsRepository.findOneBy({
      id: productId,
    });
    if (!product)
      throw new NotFoundException(`Producto con id ${productId} no encontrado`);
    const response = await this.fileRepository.uploadImage(file);
    if (!response.secure_url)
      throw new BadRequestException(`Error al cargar la imagen en Cloudinary`);
    await this.productsRepository.update(productId, {
      imgUrl: response.secure_url,
    });
    const updateProduct = await this.productsRepository.findOneBy({
      id: productId,
    });
    return updateProduct;
  }
}
