import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { validateUser, validateUserUpdate } from './user.validate';
import { AuthGuard } from '../auth/guards/auth.guards';
import { Users } from './entities/user.entity';
import {updateUserDto } from './dtos/user.dto';
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


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @HttpCode(200)
  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
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
    description: 'Usuarios por página',
  })
  @ApiResponse({ status: 200, type: [Users] })
  @ApiResponse({ status: 403 })
  getAllUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Omit<Users, 'password'>[]> {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const ValidatePage = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
    const Validatelimit = !isNaN(limitNum) && limitNum > 0 ? limitNum : 5;
    return this.usersService.getAllUsers(ValidatePage, Validatelimit);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'Id del usuario a consultar',
    type: String,
  })
  @ApiResponse({ status: 200, type: Users })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para ver este perfil',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario con id {id} no encontrado',
  })
  async getUserById(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Req() request: any,
  ): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    const userIn = request.user;
    if (!userIn.roles.includes(Role.Admin) && userIn.id !== id) {
      throw new ForbiddenException('No tienes permiso para ver este perfil');
    }
    const userFound = await this.usersService.getUserById(id);
    return userFound;
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UseGuards(AuthGuard) // para que el usuario entre
  @ApiOperation({
    summary:
      'Actualizar el  perfil del usuario (propio) o cualquier perfil si soy Admin',
  })
  @ApiParam({
    name: 'id',
    description: 'Id del usuario a modificar',
    type: String,
  })
  @ApiBody({ type: updateUserDto })
  @ApiResponse({ status: 200, type: Users })
  @ApiResponse({
    status: 403,
    description: 'No tienes permiso para modificar a otro usuario',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se enviaron campos para actualizar. El cuerpo de la solicitud no puede estar vacío. / El administrador no puede cambiar la contraseña de otros usuarios.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario con id {id} no encontrado',
  })
  updateUser(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() userData: updateUserDto,
    @Req() request: any, // El AuthGuard inyecta el usuario logueado aquí
  ): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    // validateUserUpdate(userData);
    const userIn = request.user; // Datos extraídos del JWT
    const admin = userIn.roles.includes(Role.Admin);
    const isOwner = userIn.id === id;

    if (!admin && !isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para modificar a otro usuario',
      );
    }
    if (admin && !isOwner) {
      if (userData.password) {
        throw new BadRequestException(
          'El administrador no puede cambiar la contraseña de otros usuarios por seguridad.',
        );
      }
    }

    return this.usersService.updateUser(id, userData);
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'Id del usuario a eliminar' })
  @ApiResponse({ status: 200, type: 'a731cf93-2j6k-40f0-8af8-015995fe1754' })
  @ApiResponse({ status: 403 })
  @ApiResponse({
    status: 404,
    description: 'Usuario con id {id} no encontrado',
  })
  deleteUser(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Req() request: any,
  ) {
    const userIn = request.user; // Datos extraídos del JWT
    if (!userIn.roles.includes(Role.Admin) && userIn.id !== id) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar a otro usuario',
      );
    }
    return this.usersService.deleteUser(id);
  }

}

