import { Module } from '@nestjs/common';
import { SaidasEstoqueService } from './saidas-estoque.service';
import { SaidasEstoqueController } from './saidas-estoque.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SaidasEstoqueController],
  providers: [SaidasEstoqueService, PrismaService],
})
export class SaidasEstoqueModule {}
