import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadPipe } from './pipes/file.pipe';
import { AuthGuard } from '../auth/guards/auth.guards';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Products } from '../products/entities/product.entity';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post('uploadImage/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifica la imagen de un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto a modificar la imagen',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'La imagen se cargo completamente en Cloudinary y se guardo la url en la Base de Datos',
    type: Products,
  })
  @ApiResponse({
    status: 400,
    description: 'La imagen no se cargo correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'No se encontró el producto para cargar la imagen',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') productId: string,
    @UploadedFile(ImageUploadPipe) file: Express.Multer.File,
  ) {
    return this.fileService.uploadImage(file, productId);
  }
}
