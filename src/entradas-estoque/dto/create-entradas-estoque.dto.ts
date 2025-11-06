// src/entradas-estoque/dto/create-entrada-estoque.dto.ts
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEntradaEstoqueDto {
  @IsInt()
  @IsNotEmpty()
  produtoId: number; // O ID do Produto que está entrando

  @IsInt()
  @IsPositive() // Deve ser maior que 0
  quantidade: number;

  @IsString()
  @IsOptional()
  lote?: string;

  @IsDateString()
  @IsOptional()
  data_validade?: string;
}