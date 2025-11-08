import { Module } from '@nestjs/common';
import { NotasComportamentoService } from './notas-comportamento.service';
import { NotasComportamentoController } from './notas-comportamento.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [NotasComportamentoController],
  providers: [NotasComportamentoService, PrismaService],
})
export class NotasComportamentoModule {}
