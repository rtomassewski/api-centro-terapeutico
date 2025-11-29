import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDto } from './create-agendamento.dto';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

// Precisamos redefinir o Enum aqui ou importar do client, 
// mas para DTO geralmente definimos para validar a string
export enum FormaPagamento {
  DINHEIRO = 'DINHEIRO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX',
  CONVENIO = 'CONVENIO'
}

export class UpdateAgendamentoDto extends PartialType(CreateAgendamentoDto) {
  
  @IsOptional()
  @IsBoolean()
  pago?: boolean; // No seu schema é Boolean, não Enum

  @IsOptional()
  @IsEnum(FormaPagamento)
  forma_pagamento?: FormaPagamento;

  @IsOptional()
  @IsNumber()
  valor_pago?: number;
}