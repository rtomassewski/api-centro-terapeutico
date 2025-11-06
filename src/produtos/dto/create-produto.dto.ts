// src/produtos/dto/create-produto.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UnidadeMedida } from '@prisma/client'; // Importe o Enum do Prisma

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
}