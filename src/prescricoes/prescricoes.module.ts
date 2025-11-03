// src/prescricoes/prescricoes.module.ts
import { Module } from '@nestjs/common';
import { PrescricoesService } from './prescricoes.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PrescricoesService, PrismaService],
  exports: [PrescricoesService] // Exporta o serviço
})
export class PrescricoesModule {}
