import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dtos/order.dto';
import { Orders } from './entities/order.entity';
import { AuthGuard } from '../auth/guards/auth.guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Role } from '../common/enums/roles.enum';

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener detalle de una orden ' })
  @ApiParam({
    name: 'id',
    description: 'ID de la orden ',
    type: String,
  })
  @ApiResponse({
    status: 200,
    type: Orders,
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: 403,
  })
  getOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: any,
  ): Promise<Orders> {
    const userIn = request.user;
    return this.ordersService.getOrder(id, userIn);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear una nueva orden de compra' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    type: Orders,
  })
  @ApiResponse({
    status: 404,
    description:
      'El usuario con ID {id} no existe / El producto con ID {id} no existe / Error al recuperar la orden creada',
  })
  @ApiResponse({
    status: 400,
    description:
      'El producto "{nombre}" no está disponible para la venta / No hay stock disponible para el producto: {nombre}',
  })
  @ApiResponse({
    status: 403,
    description: 'No puedes crear una orden para otro usuario',
  })
  async addOrder(
    @Body() data: CreateOrderDto,
    @Req() request: any,
  ): Promise<Orders> {
    const { user_id, products } = data;
    const userIn = request.user;
    if (!userIn.roles.includes(Role.Admin) && userIn.id !== user_id) {
      throw new ForbiddenException(
        'No puedes crear una orden para otro usuario',
      );
    }
    return this.ordersService.addOrder(data);
  }
  
}
