// src/clinicas/dto/create-clinica.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClinicaDto {
  @IsString()
  @IsNotEmpty()
  razao_social: string;

  @IsString()
  @IsNotEmpty()
  nome_fantasia: string;

  @IsString()
  @Length(14, 14) // CNPJ tem 14 dígitos
  cnpj: string;
}
