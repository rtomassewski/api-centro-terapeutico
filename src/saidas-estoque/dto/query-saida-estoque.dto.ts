// src/saidas-estoque/dto/query-saida-estoque.dto.ts
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QuerySaidaEstoqueDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number) // Converte a string da query "1" para o número 1
  produtoId?: number; // Para filtrar o histórico de um produto
}