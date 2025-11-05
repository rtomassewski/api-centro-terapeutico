// src/pacientes/dto/update-paciente.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}

// É só isso. Agora este DTO aceita opcionalmente:
// nome_completo?: string;
// nome_social?: string;
// data_nascimento?: string;
// cpf?: string;
// ...etc.