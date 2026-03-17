import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import data from '../utils/data.json';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<Categories[]> {
    return await this.categoriesRepository.find();
  }

  async addCategories(): Promise<string> {
    // Si la importación trajo el JSON como un objeto con 'default', lo extraemos
    const actualData = Array.isArray(data) ? data : (data as any).default;
    if (!actualData || !Array.isArray(actualData)) {
      throw new NotFoundException(
        'No se pudo leer el arreglo de datos del JSON',
      );
    }
    const insertPromise = data.map((element) =>
      this.categoriesRepository
        .createQueryBuilder()
        .insert()
        .into(Categories)
        .values({ name: element.category })
        .orIgnore()
        .execute(),
    );
    await Promise.all(insertPromise);
    return 'Categorias agregadas con exito';
  }
}
