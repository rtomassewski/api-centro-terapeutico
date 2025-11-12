// src/auth/dto/create-trial.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateTrialDto {
  // Dados da Clínica
  @IsString()
  @IsNotEmpty()
  nome_fantasia: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'O CNPJ deve ter 14 dígitos' })
  cnpj: string;

  // Dados do Administrador
  @IsString()
  @IsNotEmpty()
  nome_admin: string;

  @IsEmail()
  email_admin: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha_admin: string;
}