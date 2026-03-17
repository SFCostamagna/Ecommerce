import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto, updateUserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<Users, 'password'>[]> {
    const skip = (page - 1) * limit;
    const userList = await this.usersRepository.find({
      skip: skip,
      take: limit,
    });
    return userList.map(({ password, ...userSinPassword }) => userSinPassword);
  }

  async getUserById(id: string): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    const userFound = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userFound)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    const { password, isAdmin, ...userFiltered } = userFound;
    return userFiltered;
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async addUser(newUserData: CreateUserDto): Promise<string> {
    const saveUser = await this.usersRepository.save(newUserData);
    return saveUser.id;
  }

  async updateUser(
    id: string,
    newUserData: updateUserDto,
  ): Promise<Omit<Users, 'password' | 'isAdmin'>> {
    if (Object.keys(newUserData).length === 0) {
      throw new BadRequestException(
        'No se enviaron campos para actualizar. El cuerpo de la solicitud no puede estar vacío.',
      );
    }
    const userFound = await this.usersRepository.findOneBy({ id });
    if (!userFound)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (newUserData.password) {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);
      newUserData.password = hashedPassword;
    }
    const mergedUser = this.usersRepository.merge(userFound, newUserData);
    const savedUser = await this.usersRepository.save(mergedUser);
    const { password, isAdmin, ...userUpdate } = savedUser;
    return userUpdate;
  }

  async deleteUser(id: string): Promise<string> {
    await this.getUserById(id);
    await this.usersRepository.update(id, { isActive: false });
    return id;
  }

}
