// src/sinais-vitais/dto/query-sinal-vital.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QuerySinalVitalDto {

  @IsInt()
  @IsNotEmpty() // Note: Estamos exigindo o pacienteId na query
  @Type(() => Number)
  pacienteId: number; // OBRIGATÓRIO

  @IsDateString()
  @IsOptional()
  data_inicio?: string; // Filtro de período

  @IsDateString()
  @IsOptional()
  data_fim?: string; // Filtro de período
}