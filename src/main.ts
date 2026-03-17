import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { environment } from './config/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Borra lo que no está en el DTO
      forbidNonWhitelisted: true, //Lanza error 400 si mandan campos prohibidos
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('Proyecto Integrador Back M4 PT29')
    .setDescription('Aplicacion creada con NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const PORT = environment.PORT;
  const HOST = environment.HOST;
  await app.listen(PORT);
  console.log(`Servidor escuchando en hhtp://${HOST}:${PORT}/`);
}
bootstrap();
