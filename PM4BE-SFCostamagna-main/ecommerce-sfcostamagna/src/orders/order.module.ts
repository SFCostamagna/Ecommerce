import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './order.controller';
import { OrdersRepository } from './order.repository';
import { OrdersService } from './order.service';
import { Orders } from '../orders/entities/order.entity';
import { Users } from '../users/entities/user.entity';
import { Products } from '../products/entities/product.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Users, Products, OrderDetails])],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService, UsersRepository],
})
export class OrdersModule {}
