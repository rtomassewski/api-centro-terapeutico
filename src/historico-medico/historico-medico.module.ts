import { Module } from '@nestjs/common';
import { HistoricoMedicoService } from './historico-medico.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [HistoricoMedicoService, PrismaService],
  exports: [HistoricoMedicoService],
})
export class HistoricoMedicoModule {}
