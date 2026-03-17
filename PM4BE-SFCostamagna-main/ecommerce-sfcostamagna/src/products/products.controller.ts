import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/guards/auth.guards';
import { validateProduct, validateProductUpdate } from './product.validate';
import { Products } from './entities/product.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Role } from '../common/enums/roles.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @HttpCode(200)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos paginados' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
    description: 'Numero de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: String,
    description: 'Productos por página',
  })
  @ApiResponse({
    status: 200,
    type: [Products],
  })
  getAllProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Products[]> {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const realPage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const realLimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 5;

   return this.productsService.getAllProducts(realPage, realLimit);
    
  }

  @Get('seeder')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Ejecutar el seeder de productos' })
  @ApiResponse({ status: 200, description: 'Productos agregados' })
  @ApiResponse({ status: 404, description: 'La categoria {nombre} no existe' })
  @ApiResponse({ status: 403, description: 'No tenes acceso a esta ruta' })
  async addProduct(): Promise<string> {
    return await this.productsService.addProduct();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su UUID' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    type: String,
  })
  @ApiResponse({ status: 200, type: Products })
  @ApiResponse({
    status: 404,
    description: 'Producto con id {id} no encontrado',
  })
  getProductById(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<Products> {
    return this.productsService.getProductById(id);
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    type: String,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, type: Products })
  @ApiResponse({
    status: 400,
    description:
      'No se enviaron datos para actualizar. El cuerpo de la petición no puede estar vacío.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el producto con ID {id}',
  })
  updateProduct(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() productNewData: UpdateProductDto,
  ): Promise<Products> {
    //validateProductUpdate(productNewData);
    return this.productsService.updateProduct(id, productNewData);
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    type: String,
  })
  @ApiResponse({ status: 200, type: 'a87bc4e5-20af-4927-bd44-249fd33473kk' })
  @ApiResponse({
    status: 404,
    description: 'Producto con id {id} no encontrado',
  })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return this.productsService.deleteProduct(id);
  }
  @Get('product')
  @ApiQuery({
    name: 'nameProduct',
    type: String
  })
  async getProductByName(@Query('nameProduct') nameProduct:string) {
    return await this.productsService.getProductByName(nameProduct)
  }
}
