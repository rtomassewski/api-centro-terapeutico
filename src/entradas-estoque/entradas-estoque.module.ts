import { Module } from '@nestjs/common';
import { EntradasEstoqueService } from './entradas-estoque.service';
import { EntradasEstoqueController } from './entradas-estoque.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EntradasEstoqueController],
  providers: [EntradasEstoqueService, PrismaService],
})
export class EntradasEstoqueModule {}
