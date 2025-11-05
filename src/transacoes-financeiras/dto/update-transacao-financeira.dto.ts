// src/transacoes-financeiras/dto/update-transacao-financeira.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTransacaoFinanceiraDto } from './create-transacao-financeira.dto';
import { IsDateString, IsOptional } from 'class-validator';

// Herda tudo do CreateDTO (opcional)
export class UpdateTransacaoFinanceiraDto extends PartialType(
  CreateTransacaoFinanceiraDto,
) {
  // Adicionamos um campo específico para "Marcar como Pago"
  @IsDateString()
  @IsOptional()
  data_pagamento?: string;
}