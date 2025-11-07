// src/leitos/dto/update-leito.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateLeitoDto } from './create-leito.dto';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { StatusLeito } from '@prisma/client';

export class UpdateLeitoDto extends PartialType(CreateLeitoDto) {
  @IsEnum(StatusLeito)
  @IsOptional()
  @IsIn([
    // O Admin só pode definir estes status manualmente.
    // 'OCUPADO' só pode ser definido pelo Check-in.
    StatusLeito.DISPONIVEL,
    StatusLeito.MANUTENCAO,
    StatusLeito.RESERVADO,
  ])
  status?: StatusLeito;
}