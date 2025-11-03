// src/pacientes/pacientes.module.ts
import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { PrismaService } from '../prisma.service'; // 1. Importe
import { EvolucoesModule } from '../evolucoes/evolucoes.module';
import { PrescricoesModule } from '../prescricoes/prescricoes.module';

@Module({
  imports: [EvolucoesModule, PrescricoesModule],
  controllers: [PacientesController],
  providers: [
    PacientesService,
    PrismaService // 2. Adicione
  ],
})
export class PacientesModule {}
