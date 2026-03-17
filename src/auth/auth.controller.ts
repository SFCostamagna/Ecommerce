import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dtos/user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Users } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    type: Users,
  })
  @ApiResponse({
    status: 400,
    description: 'El email ya existe o la contraseña no puede ser hasheada',
  })
  signUp(@Body() userData: CreateUserDto) {
    return this.authService.signUp(userData);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginUserDto })
  @Post('signin')
  @ApiResponse({
    status: 200,
    description: 'Login exitoso.',
    schema: {
      example: {
        message: 'Usuario logueado',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNzMxY2Y5My0yYzZiLTQwZjAtOGFmOC0wMTU5OTVmZTE3NTQiLCJpZCI6ImE3MzFjZjkzLTJjNmItNDBmMC04YWY4LTAxNTk5NWZlMTc1NCIsImVtYWlsIjoiZGVtbzFAbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzY5Mjc2NDIyLCJleHAiOjE3NjkyODAwMjJ9.Dm-O8Uk1kihtXsoB6FrGbkdg4fjpkz_3-6mZzAle0XM',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales incorrectas.',
  })
  @ApiResponse({
    status: 403,
    description: 'La cuenta:${email} esta inactiva. Comunicate con soporte',
  })
  async signIn(@Body() credentials: LoginUserDto): Promise<Object> {
    const { email, password } = credentials;
    return await this.authService.signIn(email, password);
  }
}
