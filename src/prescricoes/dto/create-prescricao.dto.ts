// src/prescricoes/dto/create-prescricao.dto.ts
import { IsString, IsNotEmpty, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreatePrescricaoDto {
  @IsInt()
  @IsNotEmpty()
  produtoId: number; // ID do Produto (ex: "Sertralina 50mg")

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantidade_por_dose?: number; // Quantas unidades (ex: 1, 2)

  @IsString()
  @IsOptional()
  dosagem?: string; // Campo de texto (ex: "50mg")

  @IsString()
  @IsNotEmpty()
  posologia: string; // ex: "1 comprimido a cada 8h"
}