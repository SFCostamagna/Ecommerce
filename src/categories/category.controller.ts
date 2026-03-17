import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { Categories } from './entities/category.entity';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guards';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  getCategories(): Promise<Categories[]> {
    return this.categoriesService.getCategories();
  }

  @ApiBearerAuth()
  @Get('seeder')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Ejecutar el seeder de categorías' })
  addCategories(): Promise<string> {
    return this.categoriesService.addCategories();
  }
}
