import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { CreateOrderDto } from './dtos/order.dto';
import { Orders } from './entities/order.entity';
import { Users } from '../users/entities/user.entity';
import { Role } from '../common/enums/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async getOrder(id: string, userIn: any): Promise<Orders> {
    const order = await this.ordersRepository.getOrder(id);
    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }
    const isAdmin = userIn.roles.includes(Role.Admin);
    const isOwner = order.user.id === userIn.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('No tienes permiso para ver esta orden');
    }

    return order;
  }

  async addOrder(data: CreateOrderDto): Promise<Orders> {
    return this.ordersRepository.addOrder(data);
  }
}
