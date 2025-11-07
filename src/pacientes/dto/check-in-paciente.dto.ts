// src/pacientes/dto/check-in-paciente.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

export class CheckInPacienteDto {
  @IsInt()
  @IsNotEmpty()
  leitoId: number; // O ID do Leito que será ocupado
}