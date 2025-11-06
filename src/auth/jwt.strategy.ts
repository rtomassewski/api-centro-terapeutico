// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';
import { StatusLicenca } from '@prisma/client'; // 1. CORREÇÃO: Importe o StatusLicenca

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MINHA_CHAVE_SECRETA_SUPER_SEGURA_123456',
    });
  }

  // 1. Atualize o tipo do payload
  async validate(payload: {
    sub: number;
    email: string;
    papelId: number;
    clinicaId: number;
    licencaStatus: StatusLicenca;
  }) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      include: {
        papel: { select: { nome: true } },
        clinica: {
          include: { licenca: true },
        },
      },
    });

    // 2. CORREÇÃO: Adicionamos a verificação de licença nula
    if (
      !usuario ||
      !usuario.ativo ||
      usuario.clinicaId !== payload.clinicaId ||
      !usuario.clinica.licenca || // <-- CHECA SE A LICENÇA EXISTE
      usuario.clinica.licenca.status !== payload.licencaStatus
    ) {
      throw new UnauthorizedException('Usuário ou token inválido.');
    }

    const { senha_hash, ...result } = usuario;
    return result;
  }
}