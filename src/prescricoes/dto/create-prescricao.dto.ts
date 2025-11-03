// src/prescricoes/dto/create-prescricao.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePrescricaoDto {
  @IsString()
  @IsNotEmpty()
  medicamento: string;

  @IsString()
  @IsNotEmpty()
  dosagem: string; // ex: "100mg"

  @IsString()
  @IsNotEmpty()
  posologia: string; // ex: "1 comprimido a cada 8h"
}
