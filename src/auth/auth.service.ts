// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StatusLicenca, TipoPlano } from '@prisma/client';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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
        clinica: usuario.clinica,
      }
    };
  }
  async updatePerfil(userId: number, dto: UpdatePerfilDto) {
    // A validação do DTO já impediu que campos
    // sensíveis (como papelId) fossem enviados.
    
    return this.prisma.usuario.update({
      where: {
        id: userId, // Atualiza apenas o ID do token
      },
      data: dto, // Passa os dados permitidos
      select: {
        // Retorna o perfil atualizado (sem a senha)
        id: true,
        nome_completo: true,
        email: true,
        registro_conselho: true,
        assinatura_url: true,
      },
    });
  }
}
