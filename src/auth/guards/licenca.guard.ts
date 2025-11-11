// src/auth/guards/licenca.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoPlano } from '@prisma/client';
import { PLANOS_KEY } from '../decorators/planos.decorator';

@Injectable()
export class LicencaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtém os planos necessários (definidos no @Planos)
    const planosExigidos = this.reflector.getAllAndOverride<TipoPlano[]>(
      PLANOS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Se a rota não especificou @Planos, permite o acesso
    if (!planosExigidos || planosExigidos.length === 0) {
      return true;
    }

    // 3. Obtém o utilizador (que o JwtStrategy anexou)
    const { user } = context.switchToHttp().getRequest();

    // 4. (SEGURANÇA) Se o req.user ou a licença não existirem, bloqueia
    if (!user || !user.clinica?.licenca) {
      throw new ForbiddenException('Licença não encontrada no token.');
    }

    // 5. O PLANO ATUAL DO UTILIZADOR
    const planoAtual = user.clinica.licenca.plano;
    
    // 6. A VERIFICAÇÃO:
    // O plano atual do utilizador está na lista de planos exigidos?
    const temPermissao = planosExigidos.includes(planoAtual);

    if (!temPermissao) {
      throw new ForbiddenException(
        `A sua licença (Plano ${planoAtual}) não dá acesso a esta funcionalidade.`
      );
    }
    
    return true;
  }
}