import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entities/user.entity';
import { CreateUserDto, updateUserDto } from './dtos/user.dto';


@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  getAllUsers(page: number, limit: number): Promise<Omit<Users, 'password'>[]> {
    return this.usersRepository.getAllUsers(page, limit);
  }
  async getUserById(id: string): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    const userFiltered = await this.usersRepository.getUserById(id);
    return userFiltered;
  }
  addUser(user: CreateUserDto): Promise<string> {
    return this.usersRepository.addUser(user);
  }
  updateUser(
    id: string,
    userData: updateUserDto,
  ): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    return this.usersRepository.updateUser(id, userData);
  }
  deleteUser(id: string): Promise<string> {
    const userFound = this.usersRepository.getUserById(id);
    if (!userFound) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.usersRepository.deleteUser(id);
  }
}  
