// src/saidas-estoque/dto/create-saida-estoque.dto.ts
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSaidaEstoqueDto {
  @IsInt()
  @IsNotEmpty()
  produtoId: number; // O ID do Produto que está saindo

  @IsInt()
  @IsPositive() // Deve ser maior que 0
  quantidade: number;

  @IsString()
  @IsNotEmpty()
  motivo: string; // OBRIGATÓRIO: "Perda", "Ajuste", "Vencimento"
}