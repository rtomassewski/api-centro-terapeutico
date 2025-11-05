import { Module } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { AgendamentosController } from './agendamentos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AgendamentosController],
  providers: [AgendamentosService, PrismaService],
})
export class AgendamentosModule {}
