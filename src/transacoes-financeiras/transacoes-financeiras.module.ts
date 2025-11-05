import { Module } from '@nestjs/common';
import { TransacoesFinanceirasService } from './transacoes-financeiras.service';
import { TransacoesFinanceirasController } from './transacoes-financeiras.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TransacoesFinanceirasController],
  providers: [TransacoesFinanceirasService, PrismaService],
})
export class TransacoesFinanceirasModule {}
