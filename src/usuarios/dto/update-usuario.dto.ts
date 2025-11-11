// src/usuarios/dto/update-usuario.dto.ts
import { IsInt, IsOptional, IsString, IsBoolean, IsUrl } from 'class-validator';

// Não vamos usar o PartialType(CreateUsuarioDto) porque NÃO queremos
// permitir a atualização de 'email' ou 'senha' por esta rota.
// Senha deve ter uma rota própria ('/auth/reset-password')
// E-mail (login) não deve ser alterado.

export class UpdateUsuarioDto {
  
  @IsString()
  @IsOptional()
  nome_completo?: string;

  @IsInt()
  @IsOptional()
  papelId?: number; 

  @IsString()
  @IsOptional()
  registro_conselho?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean; // Permite o admin reativar um usuário
  
  @IsUrl({}, { message: 'O URL da assinatura deve ser um link válido (ex: https://...)' })
  @IsOptional()
  assinatura_url?: string;
}