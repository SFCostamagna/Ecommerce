import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            return reject(new Error(error.message || 'Error en Cloudinary'));
          }
          if (!result) {
            return reject(new Error('No se recibió respuesta de Cloudinary'));
          }
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }
}
