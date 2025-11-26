import { Module } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { ProcedimentosController } from './procedimentos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProcedimentosController],
  providers: [ProcedimentosService, PrismaService],
})
export class ProcedimentosModule {}