// src/usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  
  @IsString()
  @IsNotEmpty()
  nome_completo: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string; 

  @IsInt()
  papelId: number; 

  @IsInt()
  clinicaId: number;
  
  @IsString()
  @IsOptional()
  registro_conselho?: string; 
}