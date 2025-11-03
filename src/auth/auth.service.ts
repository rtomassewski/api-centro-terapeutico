// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    // 1. Encontrar o usuário pelo e-mail
    // (Precisaremos criar o método 'findByEmail' no UsuariosService)
    const usuario = await this.usuariosService.findByEmail(email);

    if (usuario) {
      // 2. Comparar a senha enviada com o hash salvo no banco
      const isMatch = await bcrypt.compare(pass, usuario.senha_hash);
      
      if (isMatch) {
        // 3. Se bater, retorna o usuário (sem a senha)
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
    // O "payload" é o que vamos guardar dentro do token
    // Guardamos o ID e o Papel para saber quem ele é e o que pode fazer
    const payload = { 
      sub: usuario.id, // 'sub' (subject) é o padrão do JWT para o ID
      email: usuario.email,
      papelId: usuario.papelId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome_completo,
        email: usuario.email,
        papelId: usuario.papelId
      }
    };
  }
}
