// src/pagamentos/dto/super-update-licenca.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { StatusLicenca, TipoPlano } from '@prisma/client';

export class SuperUpdateLicencaDto {
  
  @IsEnum(TipoPlano)
  @IsOptional()
  plano?: TipoPlano;

  @IsEnum(StatusLicenca)
  @IsOptional()
  status?: StatusLicenca;
  
  // (Poderíamos adicionar 'data_expiracao' aqui também, mas vamos manter simples por agora)
}