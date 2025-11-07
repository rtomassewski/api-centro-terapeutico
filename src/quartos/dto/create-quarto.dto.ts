// src/quartos/dto/create-quarto.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuartoDto {
  @IsString()
  @IsNotEmpty()
  nome: string; // Ex: "Quarto 101"

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsInt()
  @IsNotEmpty()
  alaId: number; // O ID da Ala (ex: 1)
}