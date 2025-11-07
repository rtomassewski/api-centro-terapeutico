// src/quartos/dto/query-quarto.dto.ts
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryQuartoDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number) // Converte a string da query "1" para o número 1
  alaId?: number; // Para filtrar por Ala
}