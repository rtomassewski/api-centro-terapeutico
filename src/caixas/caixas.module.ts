// src/caixas/caixas.module.ts
import { Module } from '@nestjs/common';
import { CaixasService } from './caixas.service';
import { CaixasController } from './caixas.controller';
import { PrismaService } from '../prisma.service'; // Ajuste o caminho se necessário

@Module({
  controllers: [CaixasController],
  providers: [CaixasService, PrismaService],
  exports: [CaixasService],
})
export class CaixasModule {}