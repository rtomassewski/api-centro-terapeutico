import { Module } from '@nestjs/common';
import { SinaisVitaisService } from './sinais-vitais.service';
import { SinaisVitaisController } from './sinais-vitais.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SinaisVitaisController],
  providers: [SinaisVitaisService, PrismaService],
})
export class SinaisVitaisModule {}
