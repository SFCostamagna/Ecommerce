import { Module } from '@nestjs/common';
import { CategoriesController } from './category.controller';
import { CategoriesRepository } from './category.repository';
import { CategoriesService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Users } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Categories, Users])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, UsersRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
