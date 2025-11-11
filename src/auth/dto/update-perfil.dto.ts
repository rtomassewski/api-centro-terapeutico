// src/auth/dto/update-perfil.dto.ts
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePerfilDto {
  // O usuário pode mudar o próprio nome
  @IsString()
  @IsOptional()
  nome_completo?: string;

  // O usuário pode atualizar o registro do conselho
  @IsString()
  @IsOptional()
  registro_conselho?: string;

  // O usuário pode atualizar a assinatura
  @IsUrl({}, { message: 'O URL da assinatura deve ser um link válido' })
  @IsOptional()
  assinatura_url?: string;
  
  // (Note: 'email', 'senha', 'papelId', 'ativo' são intencionalmente omitidos)
}