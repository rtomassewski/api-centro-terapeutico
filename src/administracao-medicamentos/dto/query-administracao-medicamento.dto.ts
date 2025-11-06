// src/administracao-medicamentos/dto/query-administracao-medicamento.dto.ts
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { StatusAdministracao } from '@prisma/client';
import { Type } from 'class-transformer'; // Importe o Type

export class QueryAdministracaoMedicamentoDto {
  
  @IsEnum(StatusAdministracao)
  @IsOptional()
  status?: StatusAdministracao; // PENDENTE, ADMINISTRADO, etc.

  @IsInt()
  @IsOptional()
  @Type(() => Number) // Converte a string da query "1" para o número 1
  pacienteId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number) // Converte a string "5" para o número 5
  usuarioAdministrouId?: number; // Para filtrar por quem administrou

  @IsDateString()
  @IsOptional()
  data_inicio?: string; // Filtro de período (data_hora_prevista)

  @IsDateString()
  @IsOptional()
  data_fim?: string; // Filtro de período (data_hora_prevista)
}