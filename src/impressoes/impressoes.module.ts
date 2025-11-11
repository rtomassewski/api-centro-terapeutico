// src/impressoes/impressoes.module.ts
import { Module } from '@nestjs/common';
import { ImpressoesService } from './impressoes.service';
import { ImpressoesController } from './impressoes.controller';
import { PrismaService } from '../prisma.service'; // 1. Importe o PrismaService

@Module({
  controllers: [ImpressoesController],
  providers: [
    ImpressoesService,
    PrismaService, // 2. Adicione o PrismaService aqui
  ],
})
export class ImpressoesModule {}