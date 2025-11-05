// src/agendamentos/dto/query-agendamento.dto.ts
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // Importe o Type

export class QueryAgendamentoDto {
  
  @IsOptional()
  @IsDateString()
  data_inicio?: string; // Ex: "2025-11-10T00:00:00Z"

  @IsOptional()
  @IsDateString()
  data_fim?: string; // Ex: "2025-11-17T23:59:59Z"

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Converte a string da query "1" para o número 1
  usuarioId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Converte a string da query "5" para o número 5
  pacienteId?: number;
}