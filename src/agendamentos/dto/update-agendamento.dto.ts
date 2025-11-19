import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoDto } from './create-agendamento.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusAgendamento } from '@prisma/client'; // <-- CORRETO

export class UpdateAgendamentoDto extends PartialType(CreateAgendamentoDto) {
    
    @IsEnum(StatusAgendamento) // <-- CORRETO: Valida contra AGENDADO, REALIZADO...
    @IsOptional()
    status?: StatusAgendamento;
}