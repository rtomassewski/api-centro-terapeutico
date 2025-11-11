// src/transacoes-financeiras/dto/query-transacao-financeira.dto.ts
import { IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoTransacao } from '@prisma/client';

export class QueryTransacaoFinanceiraDto {
  
  @IsInt()
  @IsOptional()
  @Type(() => Number) // Converte a string da query "1" para o número 1
  pacienteId?: number; // Para filtrar por paciente

  @IsEnum(TipoTransacao)
  @IsOptional()
  tipo?: TipoTransacao; // Para filtrar por RECEITA ou DESPESA

  @IsDateString()
  @IsOptional()
  data_inicio?: string; // Filtro de período

  @IsDateString()
  @IsOptional()
  data_fim?: string; // Filtro de período
}