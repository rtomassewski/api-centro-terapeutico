// src/produtos/dto/create-produto.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsNumber, 
} from 'class-validator';
import { UnidadeMedida } from '@prisma/client';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsEnum(UnidadeMedida)
  @IsNotEmpty()
  unidade_medida: UnidadeMedida; // UNIDADE, CAIXA, FRASCO, ML

  @IsInt()
  @Min(0)
  @IsOptional()
  estoque_minimo?: number; // Para alertas

  // --- CAMPO DE PREÇO (Correto) ---
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  valor: number; 

  // --- CAMPO DE TIPO (Faltava este!) ---
  @IsString()
  @IsOptional()
  tipo?: string; // Aceita "LOJA" ou "FARMACIA"
}