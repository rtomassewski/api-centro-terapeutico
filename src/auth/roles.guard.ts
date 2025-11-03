// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NomePapel } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega os papéis permitidos (definidos no @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<NomePapel[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Se nenhum papel é exigido (@Roles não foi usado), libera o acesso
    if (!requiredRoles) {
      return true;
    }

    // 3. Pega o usuário (que a JwtStrategy anexou)
    const { user } = context.switchToHttp().getRequest();

    // 4. Verifica se o papel do usuário está na lista de papéis permitidos
    // (Graças à nossa mudança na JwtStrategy, 'user.papel.nome' existe)
    return requiredRoles.some((role) => user.papel.nome === role);
  }
}
