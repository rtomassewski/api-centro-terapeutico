// src/pagamentos/dto/super-update-licenca.dto.ts
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { StatusLicenca, TipoPlano } from '@prisma/client';

export class SuperUpdateLicencaDto {
  
  @IsEnum(TipoPlano)
  @IsOptional()
  plano?: TipoPlano;

  @IsEnum(StatusLicenca)
  @IsOptional()
  status?: StatusLicenca;

  @IsDateString()
  @IsOptional()
  data_expiracao?: string;
  
  // (Poderíamos adicionar 'data_expiracao' aqui também, mas vamos manter simples por agora)
}