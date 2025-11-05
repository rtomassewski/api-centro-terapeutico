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
  senha: string; // Recebemos a senha pura, vamos criptografar no Service

  @IsInt()
  papelId: number; // O ID do Papel (ex: 2 para MEDICO)

  @IsString()
  @IsOptional() // O '?' torna o campo opcional
  registro_conselho?: string; // ex: "CRM-SP 123456"

}
