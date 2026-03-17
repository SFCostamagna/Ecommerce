import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(userData: CreateUserDto) {
    const { email, password } = userData;
    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (foundUser?.isActive) {
      throw new BadRequestException(`${email} ya existe`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('La contraseña no puede ser hasheada');
    }
    return await this.usersRepository.addUser({
      ...userData,
      password: hashedPassword,
    });
  }

  async signIn(email: string, password: string) {
    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (!foundUser) {
      throw new BadRequestException(`Credenciales incorrectas`);
    }
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException(`Credenciales incorrectas`);
    }
    if (!foundUser.isActive) {
      throw new ForbiddenException(
        'Tu cuenta ha sido desactivada. Contacta al soporte.',
      );
    }
    const userPayload = {
      sub: foundUser.id,
      id: foundUser.id,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
    };
    const token = this.jwtService.sign(userPayload);
    return {
      message: 'Usuario logueado',
      token,
    };
  }
}
