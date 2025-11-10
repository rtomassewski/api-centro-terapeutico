// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StatusLicenca, TipoPlano } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida se um usuário existe e se a senha está correta.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);

    if (usuario) {
      const isMatch = await bcrypt.compare(pass, usuario.senha_hash);
      
      // --- CORREÇÃO AQUI ---
      // Checa a senha E se o usuário está ativo
      if (isMatch && usuario.ativo) { 
        const { senha_hash, ...result } = usuario;
        return result;
      }
    }

    // 4. Se não encontrar ou a senha não bater, lança exceção
    throw new UnauthorizedException('E-mail ou senha inválidos.');
  }

  /**
   * Gera o Token JWT para o usuário validado
   */
  async login(usuario: any) {
    if (!usuario.clinica?.licenca) {
      throw new UnauthorizedException('Clínica ou licença não encontrada.');
    }

    const licenca = usuario.clinica.licenca;
    const payload = { 
      sub: usuario.id, // 'sub' (subject) é o padrão do JWT para o ID
      email: usuario.email,
      papelId: usuario.papelId,
      clinicaId: usuario.clinicaId,
      licencaStatus: licenca.status as StatusLicenca,
      licencaPlano: licenca.plano as TipoPlano,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome_completo,
        email: usuario.email,
        papelId: usuario.papelId,
        clinicaId: usuario.clinicaId,
        licenca: licenca,
      }
    };
  }
}
