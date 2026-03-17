import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../common/enums/roles.enum';
import { environment } from '../../config/environment';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No se envió el token');
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'No se envió el token o el método de validación es incorrecto',
      );
    }

    try {
      const secret = environment.JWT_SECRET;
      const payload = await this.jwtService.verifyAsync(token, { secret }); // si todo esta bien solo devuelve el payload,el header y la firma no
      const user = await this.usersRepository.getUserById(payload.id);
      // lo pongo por si alguien sin querer borra devuelve un 500 en vez de un 401 (Inautorizado)
      if (!user) {
        throw new UnauthorizedException('El usuario ya no existe');
      }
      if (user.isActive === false) {
        throw new UnauthorizedException(
          'Tu cuenta está inactiva. Comunicate con soporte',
        );
      }
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      const roles: Role[] = [] 
      if(payload.isAdmin) {roles.push(Role.Admin)} 
      if(roles.length === 0) {roles.push(Role.User)}  
      request.user = { ...payload, roles };
    
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }

      throw new UnauthorizedException('El token no es válido');
    }
  }
}
