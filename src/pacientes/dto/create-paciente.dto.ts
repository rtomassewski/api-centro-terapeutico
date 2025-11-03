// src/pacientes/dto/create-paciente.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsOptional, Length } from 'class-validator';

export class CreatePacienteDto {
  
  @IsString()
  @IsNotEmpty()
  nome_completo: string;

  @IsString()
  @IsOptional()
  nome_social?: string;

  @IsDateString() // Garante que a data venha no formato "AAAA-MM-DDTHH:mm:ss.sssZ"
  data_nascimento: string;

  @IsString()
  @Length(11, 11) // Garante que o CPF tenha 11 dígitos
  cpf: string;

  @IsString()
  @IsNotEmpty()
  nome_responsavel: string;

  @IsString()
  @IsNotEmpty()
  telefone_responsavel: string;
}
