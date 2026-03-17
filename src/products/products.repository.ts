import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import data from '../utils/data.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Categories } from '../categories/entities/category.entity';
import { UpdateProductDto } from './dtos/product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>, //para poder manipular la BDD
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getAllProducts(page: number, limit: number): Promise<Products[]> {
    const skip = (page - 1) * limit;
    const productsList = await this.productsRepository.find({
      relations: {
        category: true,
      },
      skip: skip, //cant de elementos a "saltar" desde el principio de la tabla.
      take: limit, //cant de elementos a traer en la pagina
    });
    return productsList;
  }

  async getById(id: string): Promise<Products> {
    const productFound = await this.productsRepository.findOneBy({ id });
    if (!productFound) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return productFound;
  }
  async addProduct(): Promise<string> {
    //verificar que la categoria exista
    const categories = await this.categoriesRepository.find();
    await Promise.all( //para ejecutar todas las inserciones en paralelo y esperar a que todas terminen correctamente
      data.map(async (elementData) => { // por cada product de la lista.. a cada elemento
        const categoryEncontrada = categories.find(
          (category) => category.name === elementData.category,
        );
        if (!categoryEncontrada)
          throw new NotFoundException(
            `La categoria ${elementData.category} no existe`,
          );
        const product = new Products();
        product.name = elementData.name;
        product.description = elementData.description;
        product.price = elementData.price;
        product.stock = elementData.stock;
        product.category = categoryEncontrada;

        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Products)
          .values(product)
          .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
          .execute();
      }),
    );
    return 'Productos agregados';
  }

  async updateProduct(
    id: string,
    productNewData: UpdateProductDto,
  ): Promise<Products> {
    if (Object.keys(productNewData).length === 0) { //es una función de JavaScript que toma un objeto 
    // y devuelve una lista (array) con los nombres de sus propiedades.
    // el usuario envía { "price": 100, "stock": 10 }, la lista será ["price", "stock"].
      throw new BadRequestException(
        'No se enviaron datos para actualizar. El cuerpo de la petición no puede estar vacío.',
      );
    }
    await this.productsRepository.update(id, productNewData);
    const updateProduct = await this.productsRepository.findOneBy({
      id,
    });
    if (!updateProduct) {
      throw new NotFoundException(`No se encontró el producto con ID ${id}`);
    }
    return updateProduct;
  }


  async deleteProduct(id: string): Promise<string> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    await this.productsRepository.update(id, { isActive: false });
    return product.id;
  }

  async getProductByName(nameProduct:string) {
    const productFound = await this.productsRepository.find({
      where: {
        name: nameProduct
      }
    })
    if (!productFound) {
      throw new NotFoundException(`el producto con nombre: ${nameProduct} no existe`)
    }
    return productFound
  }
    
}
