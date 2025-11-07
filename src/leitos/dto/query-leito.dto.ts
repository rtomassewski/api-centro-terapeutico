// src/leitos/dto/query-leito.dto.ts
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusLeito } from '@prisma/client';

export class QueryLeitoDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number) // Converte a string da query "1"
  quartoId?: number; // Para filtrar por Quarto

  @IsEnum(StatusLeito)
  @IsOptional()
  status?: StatusLeito; // Para filtrar por DISPONIVEL, OCUPADO, etc.
}