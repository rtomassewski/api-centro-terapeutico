// src/transacoes-financeiras/dto/query-transacao-financeira.dto.ts
import { IsInt, IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoTransacao } from '@prisma/client';

export class QueryTransacaoFinanceiraDto {
  
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pacienteId?: number;

  @IsEnum(TipoTransacao)
  @IsOptional()
  tipo?: TipoTransacao; // RECEITA ou DESPESA

  @IsDateString()
  @IsOptional()
  data_inicio?: string; // O Service vai ler este nome

  @IsDateString()
  @IsOptional()
  data_fim?: string; // O Service vai ler este nome
  
  // --- ADICIONE ISTO ---
  @IsString()
  @IsOptional()
  status?: string; // 'PAGO' ou 'ABERTO'
}