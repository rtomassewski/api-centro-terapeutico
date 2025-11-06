// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Adicione esta linha:
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Lança erro se campos extras forem enviados
    transform: true, // Transforma os dados de entrada (ex: string para número)
  }));

  await app.listen(3000);
}
bootstrap();
