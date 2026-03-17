import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

//Crea una función que recibe una lista de roles y los guarda bajo una "llave" llamada 'roles'en un []
// Si hacés @Roles(Role.Admin), el decorador dice: guardame en esta ruta el valor ['admin'] bajo la llave 'roles'
