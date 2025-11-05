// src/agendamentos/dto/create-agendamento.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgendamentoDto {
  @IsDateString()
  @IsNotEmpty()
  data_hora_inicio: string; // Formato: "2025-11-10T14:00:00Z"

  @IsDateString()
  @IsNotEmpty()
  data_hora_fim: string; // Formato: "2025-11-10T15:00:00Z"

  @IsInt()
  pacienteId: number; // ID do Paciente a ser agendado

  @IsInt()
  usuarioId: number; // ID do Profissional (Médico/Terapeuta)

  @IsString()
  @IsOptional()
  notas?: string;
}