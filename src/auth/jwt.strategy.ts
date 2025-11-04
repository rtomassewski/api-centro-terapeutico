// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // 1. Onde o token será procurado (no header "Authorization: Bearer ...")
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Não ignora se o token expirar (segurança)
      ignoreExpiration: false,
      // 3. A MESMA chave secreta que usamos no auth.module.ts
      secretOrKey: 'MINHA_CHAVE_SECRETA_SUPER_SEGURA_123456',
    });
  }

  /**
   * Esta função é chamada AUTOMATICAMENTE pelo Passport após
   * ele validar a assinatura do token e verificar a expiração.
   * O 'payload' é o conteúdo que colocamos dentro do token no login.
   */
  async validate(payload: { sub: number; email: string; papelId: number; clinicaId: number; }) {
    // O 'sub' (subject) é o ID do usuário que definimos no login
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
        include: {
      papel: { // Inclui o objeto Papel
        select: { nome: true }
      }
    }
    });

    if (!usuario || !usuario.ativo) {
      // Se o usuário não existir ou estiver desativado
      throw new UnauthorizedException('Usuário não autorizado.');
    }

    // O objeto 'usuario' retornado aqui será anexado ao 'Request'
    // e poderemos acessá-lo em qualquer endpoint protegido.
    // (Note: NUNCA retorne a senha_hash daqui)
    const { senha_hash, ...result } = usuario;
    return result;
  }
}
