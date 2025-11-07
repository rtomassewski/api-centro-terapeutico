import { Module } from '@nestjs/common';
import { LeitosService } from './leitos.service';
import { LeitosController } from './leitos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LeitosController],
  providers: [LeitosService, PrismaService],
})
export class LeitosModule {}
