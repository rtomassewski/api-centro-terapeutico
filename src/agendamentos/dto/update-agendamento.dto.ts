// src/agendamentos/dto/update-agendamento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDto } from './create-agendamento.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusAtendimento } from '@prisma/client';

// PartialType torna todos os campos de CreateAgendamentoDto opcionais
export class UpdateAgendamentoDto extends PartialType(CreateAgendamentoDto) {
    // data_hora já é opcional via PartialType (permite reagendamento)
    
    @IsEnum(StatusAtendimento)
    @IsOptional()
    status?: StatusAtendimento;
}