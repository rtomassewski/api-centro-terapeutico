// src/agendamentos/dto/update-agendamento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDto } from './create-agendamento.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusAgendamento } from '@prisma/client';

export class UpdateAgendamentoDto extends PartialType(CreateAgendamentoDto) {
  @IsEnum(StatusAgendamento)
  @IsOptional()
  status?: StatusAgendamento; // AGENDADO, REALIZADO, CANCELADO, FALTOU
}