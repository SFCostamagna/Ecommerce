import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { CloudinaryConfig } from '../config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { Products } from '../products/entities/product.entity';
import { Users } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Users])],
  controllers: [FileController],
  providers: [FileService, CloudinaryConfig, FileRepository, UsersRepository],
})
export class FileModule {}
