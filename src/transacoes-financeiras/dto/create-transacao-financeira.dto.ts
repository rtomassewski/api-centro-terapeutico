// src/transacoes-financeiras/dto/create-transacao-financeira.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsInt } from 'class-validator';
import { TipoTransacao } from '@prisma/client';

export class CreateTransacaoFinanceiraDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @IsEnum(TipoTransacao)
  @IsNotEmpty()
  tipo: TipoTransacao; // RECEITA ou DESPESA

  @IsInt()
  @IsNotEmpty()
  categoria_id: number; // snake_case

  @IsInt()
  @IsOptional()
  paciente_id?: number; // snake_case

  @IsDateString()
  @IsNotEmpty()
  data_vencimento: string; // snake_case

  // --- CAMPOS QUE FALTAVAM ---
  @IsInt()
  @IsOptional()
  parcelas?: number;

  @IsBoolean()
  @IsOptional()
  repetir?: boolean;
}