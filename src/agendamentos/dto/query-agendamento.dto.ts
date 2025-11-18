// src/agendamentos/dto/query-agendamento.dto.ts
import { IsDateString, IsOptional } from 'class-validator';

export class QueryAgendamentoDto {
  
  @IsDateString()
  @IsOptional()
  date?: string; // <-- CORRIGIDO: O campo usado para filtrar a agenda por dia
}