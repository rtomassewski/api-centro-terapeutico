// src/notas-comportamento/dto/query-nota-comportamento.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryNotaComportamentoDto {

  @IsInt()
  @IsNotEmpty() // Exigimos o pacienteId para listar
  @Type(() => Number)
  pacienteId: number;
}