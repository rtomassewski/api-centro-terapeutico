import { Module } from '@nestjs/common';
import { AlasService } from './alas.service';
import { AlasController } from './alas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AlasController],
  providers: [AlasService, PrismaService],
})
export class AlasModule {}
