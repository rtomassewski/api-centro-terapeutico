// src/licencas/dto/update-licenca.dto.ts
import { IsEnum, IsDateString, IsOptional } from 'class-validator';
import { StatusLicenca, TipoPlano } from '@prisma/client';

export class UpdateLicencaDto {
  @IsEnum(TipoPlano)
  @IsOptional()
  plano?: TipoPlano;

  @IsEnum(StatusLicenca)
  @IsOptional()
  status?: StatusLicenca;

  @IsDateString()
  @IsOptional()
  data_expiracao?: string;
}