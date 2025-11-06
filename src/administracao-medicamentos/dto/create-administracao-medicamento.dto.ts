// src/administracao-medicamentos/dto/create-administracao-medicamento.dto.ts
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAdministracaoMedicamentoDto {
  
  @IsDateString()
  @IsNotEmpty()
  data_hora_prevista: string; // "2025-11-06T09:00:00Z"

  @IsInt()
  pacienteId: number; // O paciente que receberá

  @IsInt()
  prescricaoId: number; // Baseado em qual prescrição

  @IsString()
  @IsOptional()
  notas?: string; // Ex: "Agendado pela Enf. Chefe"
}