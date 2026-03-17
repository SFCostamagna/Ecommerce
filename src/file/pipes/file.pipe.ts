import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const ImageUploadPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 200000,
      message: 'El archivo no debe superar los 200 kB',
    }),
    new FileTypeValidator({
      fileType: /(png|jpeg|jpg|webp|gif)$/,
    }),
  ],
  fileIsRequired: true,
});
