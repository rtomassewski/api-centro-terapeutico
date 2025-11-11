// src/clinicas/dto/update-clinica.dto.ts
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateClinicaDto {
  @IsString()
  @IsOptional()
  razao_social?: string;

  @IsString()
  @IsOptional()
  nome_fantasia?: string;

  @IsUrl({}, { message: 'O URL do logo deve ser um link válido (ex: https://...)' })
  @IsOptional()
  logo_url?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  telefone?: string;
}