import { Module } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PagamentosService, PrismaService],
  controllers: [PagamentosController]
})
export class PagamentosModule {}
