// src/alas/dto/create-ala.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlaDto {
  @IsString()
  @IsNotEmpty()
  nome: string; // Ex: "Ala Masculina A"

  @IsString()
  @IsOptional()
  descricao?: string;
}