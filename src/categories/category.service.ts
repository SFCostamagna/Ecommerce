import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './category.repository';
import { Categories } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}
  getCategories(): Promise<Categories[]> {
    return this.categoriesRepository.getCategories();
  }
  addCategories(): Promise<string> {
    return this.categoriesRepository.addCategories();
  }
}
