// src/transacoes-financeiras/dto/create-transacao-financeira.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsInt,
  IsOptional,
} from 'class-validator';
import { TipoTransacao } from '@prisma/client';

export class CreateTransacaoFinanceiraDto {
  @IsString()
  @IsNotEmpty()
  descricao: string; // Ex: "Mensalidade Paciente José - Mês 10"

  @IsNumber()
  valor: number; // Ex: 1500.00

  @IsEnum(TipoTransacao)
  tipo: TipoTransacao; // 'RECEITA' ou 'DESPESA'

  @IsDateString()
  data_vencimento: string;

  @IsInt()
  categoriaId: number; // O ID da Categoria (ex: "Mensalidades Pacientes")

  @IsInt()
  @IsOptional()
  pacienteId?: number; // Opcional: Vincula a transação a um paciente
}