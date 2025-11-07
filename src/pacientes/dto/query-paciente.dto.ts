// src/pacientes/dto/query-paciente.dto.ts
import { IsBooleanString, IsOptional } from 'class-validator';
// 1. Removemos 'Type' do 'class-transformer'

export class QueryPacienteDto {

  // 2. MUDAMOS A VALIDAÇÃO:
  // Em vez de @IsBoolean() e @Type()
  // Usamos @IsBooleanString()
  @IsBooleanString() // <-- ESTA É A MUDANÇA
  @IsOptional()
  semLeito?: string; // 3. O tipo agora é 'string'
}