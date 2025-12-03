// src/loja/loja.module.ts
import { Module } from '@nestjs/common';
import { LojaService } from './loja.service';
import { LojaController } from './loja.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LojaController],
  providers: [LojaService, PrismaService],
})
export class LojaModule {}