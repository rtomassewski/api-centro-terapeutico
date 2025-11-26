import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryAgendamentoDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  // --- ADICIONE ESTES DOIS CAMPOS ---
  @IsString()
  @IsOptional()
  pacienteId?: string; // Vem como string na URL (?pacienteId=1)

  @IsString()
  @IsOptional()
  usuarioId?: string;  // Vem como string na URL (?usuarioId=5)
}