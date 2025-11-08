// src/historico-medico/dto/create-historico-medico.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateHistoricoMedicoDto {
  @IsString() @IsOptional()
  alergias?: string;

  @IsString() @IsOptional()
  condicoes_previas?: string;

  @IsString() @IsOptional()
  medicamentos_uso_continuo?: string;

  @IsString() @IsOptional()
  historico_familiar?: string;

  @IsString() @IsOptional()
  historico_social?: string;

  @IsString() @IsOptional()
  historico_uso_substancias?: string;
}