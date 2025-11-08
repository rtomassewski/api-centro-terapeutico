// src/notas-comportamento/dto/create-nota-comportamento.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RatingComportamento } from '@prisma/client';

export class CreateNotaComportamentoDto {
  @IsInt()
  @IsNotEmpty()
  pacienteId: number;

  @IsEnum(RatingComportamento)
  @IsNotEmpty()
  nota: RatingComportamento; // OTIMO, BOM, RUIM, PESSIMO

  @IsString()
  @IsOptional()
  observacao?: string;
}