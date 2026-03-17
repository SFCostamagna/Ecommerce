import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //Busca la etiqueta llamada 'roles'.
    // Si la encuentra en el método o clase, usa esa ['Admin'] desde el Controlador.
    // Si no hay nada, requiredRoles queda como undefined
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // Si no tiene roles. esta ruta es para cualquier usuario autenticado
    if (!requiredRoles) {
      return true;
    } //toma el usuario que creamos antes en el authguard
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roles)
      throw new ForbiddenException('Usuario sin roles o no autenticado');
    const hasRole = () =>
      requiredRoles.some((role) => user?.roles?.includes(role));
    //requiredRoles es ['Admin'].
    // .some((role) => ...): Es una pregunta: "¿ Hay alguno de los roles de esta lista (['Admin'])?".
    // user?.roles?.includes(role): El Guard mira la lista del usuario y pregunta:
    // "¿Tenés el rol que estoy analizando ahora? ['Admin']".
    const valid = user && user.roles && hasRole(); // tenes el role que estoy analizando?
    if (!valid)
      throw new ForbiddenException(
        'No tiene permisos para acceder a esta ruta',
      );
    return valid; //true la Guard me deja pasar
  }
}
