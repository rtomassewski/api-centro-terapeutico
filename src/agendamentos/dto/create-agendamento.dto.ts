// src/agendamentos/dto/create-agendamento.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgendamentoDto {
  @IsInt()
  @IsNotEmpty()
  pacienteId: number;

  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsDateString()
  @IsNotEmpty()
  data_hora_inicio: string; // Ex: "2025-11-17T10:00:00Z"

  @IsString()
  @IsOptional()
  observacao?: string; // <-- CORRIGIDO: Adicionado o campo que faltava
}