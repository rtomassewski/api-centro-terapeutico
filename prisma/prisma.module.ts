import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- ESSENCIAL! Isso torna o serviço acessível a outros módulos
})
export class PrismaModule {}