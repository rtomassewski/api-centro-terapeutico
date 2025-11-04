import { Module } from '@nestjs/common';
import { ClinicasService } from './clinicas.service';
import { ClinicasController } from './clinicas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ClinicasController],
  providers: [ClinicasService, PrismaService],
})
export class ClinicasModule {}
