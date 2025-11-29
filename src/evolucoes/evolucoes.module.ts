// src/evolucoes/evolucoes.module.ts
import { Module } from '@nestjs/common';
import { EvolucoesService } from './evolucoes.service';
import { PrismaService } from '../prisma.service';
// 1. IMPORTANTE: Importe o Controller aqui
import { EvolucoesController } from './evolucoes.controller'; 

@Module({
  // 2. IMPORTANTE: Registre o Controller nesta lista
  controllers: [EvolucoesController], 
  
  providers: [
    EvolucoesService,
    PrismaService
  ],
  exports: [EvolucoesService],
})
export class EvolucoesModule {}