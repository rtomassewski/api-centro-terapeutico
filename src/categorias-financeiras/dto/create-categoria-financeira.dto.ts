// src/categorias-financeiras/dto/create-categoria-financeira.dto.ts
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TipoTransacao } from '@prisma/client';

export class CreateCategoriaFinanceiraDto {
  @IsString()
  @IsNotEmpty()
  nome: string; // Ex: "Aluguel", "Mensalidade"

  @IsEnum(TipoTransacao) // Garante que o valor seja 'RECEITA' ou 'DESPESA'
  tipo: TipoTransacao;
}