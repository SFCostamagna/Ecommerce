import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Categories } from '../categories/entities/category.entity';
import { UsersRepository } from '../users/users.repository';
import { Users } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Categories, Users])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, UsersRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
