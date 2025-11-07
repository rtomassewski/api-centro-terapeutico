// src/leitos/dto/create-leito.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeitoDto {
  @IsString()
  @IsNotEmpty()
  nome: string; // Ex: "Leito A", "Leito B"

  @IsInt()
  @IsNotEmpty()
  quartoId: number; // O ID do Quarto (ex: 101)
}