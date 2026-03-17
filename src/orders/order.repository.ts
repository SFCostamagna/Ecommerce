import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { Products } from '../products/entities/product.entity';
import { CreateOrderDto } from './dtos/order.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async getOrder(id: string): Promise<Orders> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        orderDetails: {
          products: true,
        },
      },
    });
    if (!order) throw new NotFoundException(`Orden con id ${id} no encontrada`);
    return order;
  }

  async addOrder(data: CreateOrderDto): Promise<Orders> {
    const { user_id, products } = data;

    // 1. Validar Usuario (Type Guard para evitar el error de 'null')
    const user = await this.usersRepository.findOneBy({ id: user_id });
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${user_id} no existe`);
    }

    // 2. Validar y obtener todas las entidades de Productos
    const productsEntities = await Promise.all(
      products.map(async (pDto) => {
        const product = await this.productsRepository.findOneBy({
          id: pDto.id,
        });

        if (!product) {
          throw new NotFoundException(
            `El producto con ID ${pDto.id} no existe`,
          );
        }

        if (!product.isActive) {
          throw new BadRequestException(
            `El producto "${product.name}" no está disponible para la venta`,
          );
        }

        if (product.stock <= 0) {
          throw new BadRequestException(
            `No hay stock disponible para el producto: ${product.name}`,
          );
        }

        return product;
      }),
    );

    // 3. Crear la Orden (Cabecera)
    const newOrder = new Orders();
    newOrder.date = new Date();
    newOrder.user = user;
    const savedOrder = await this.ordersRepository.save(newOrder);

    // 4. Calcular total y actualizar stock
    let total = 0;
    for (const product of productsEntities) {
      total += Number(product.price);

      // Restamos 1 unidad de stock
      await this.productsRepository.update(product.id, {
        stock: product.stock - 1,
      });
    }

    // 5. Crear el Detalle de la Orden (Relación N:N con productos)
    const orderDetail = new OrderDetails();
    orderDetail.price = Number(total.toFixed(2)); // toma el numero y lo corta en 2 decimales
    orderDetail.order = savedOrder;
    orderDetail.products = productsEntities; // Le pasamos el array completo de entidades

    await this.orderDetailsRepository.save(orderDetail);

    // 6. Retornar la orden completa con sus relaciones (incluyendo categorías)
    const result = await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: {
        orderDetails: {
          products: {
            category: true, // Traemos la categoría para que se vea en la respuesta
          },
        },
      },
    });

    if (!result)
      throw new NotFoundException('Error al recuperar la orden creada');

    return result;
  }

}
