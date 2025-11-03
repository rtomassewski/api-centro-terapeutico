// src/evolucoes/evolucoes.module.ts
import { Module } from '@nestjs/common';
import { EvolucoesService } from './evolucoes.service';
import { PrismaService } from '../prisma.service'; // 1. Importe

@Module({
  providers: [
    EvolucoesService,
    PrismaService // 2. Adicione
  ],
  exports: [EvolucoesService], // 3. Exporte o serviço
})
export class EvolucoesModule {}
