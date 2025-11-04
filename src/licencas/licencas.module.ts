import { Module } from '@nestjs/common';
import { LicencasService } from './licencas.service';
import { LicencasController } from './licencas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LicencasController],
  providers: [LicencasService, PrismaService],
})
export class LicencasModule {}
