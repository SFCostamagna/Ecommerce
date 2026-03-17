import { Injectable, Query } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Products } from './entities/product.entity';
import { UpdateProductDto } from './dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  getAllProducts(page: number, limit: number): Promise<Products[]> {
    return this.productsRepository.getAllProducts(page, limit);
  }
  getProductById(id: string): Promise<Products> {
    return this.productsRepository.getById(id);
  }
  addProduct(): Promise<string> {
    return this.productsRepository.addProduct();
  }
  updateProduct(
    id: string,
    productNewData: UpdateProductDto,
  ): Promise<Products> {
    return this.productsRepository.updateProduct(id, productNewData);
  }
  async deleteProduct(id: string): Promise<string> {
    return this.productsRepository.deleteProduct(id);
  }

  async getProductByName(nameProduct:string) {
    return  await this.productsRepository.getProductByName(nameProduct)
}
}
