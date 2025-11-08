// src/pacientes/dto/update-paciente.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  Length,
} from 'class-validator';
import { StatusPaciente } from '@prisma/client';

export class UpdatePacienteDto {
  @IsString() @IsOptional()
  nome_completo?: string;

  @IsString() @IsOptional()
  nome_social?: string;

  @IsDateString() @IsOptional()
  data_nascimento?: string;

  @IsString() @IsOptional() @Length(11, 11)
  cpf?: string;

  @IsString() @IsOptional()
  nome_responsavel?: string;

  @IsString() @IsOptional()
  telefone_responsavel?: string;

  // --- ADICIONE ESTE BLOCO ---
  @IsEnum(StatusPaciente)
  @IsOptional()
  status?: StatusPaciente; // ATIVO, ALTA, EVADIDO
  // --- FIM DA ADIÇÃO ---
}