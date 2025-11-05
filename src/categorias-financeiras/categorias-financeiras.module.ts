// src/categorias-financeiras/categorias-financeiras.module.ts

import { Module } from '@nestjs/common';
import { CategoriasFinanceirasService } from './categorias-financeiras.service';
import { CategoriasFinanceirasController } from './categorias-financeiras.controller';
import { PrismaService } from '../prisma.service'; // <-- 1. Importe o PrismaService

@Module({
  controllers: [CategoriasFinanceirasController],
  providers: [
    CategoriasFinanceirasService,
    PrismaService, // <-- 2. Adicione o PrismaService aqui
  ],
})
export class CategoriasFinanceirasModule {}