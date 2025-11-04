// src/auth/api-key.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest();
    // 1. Pega a chave enviada no header 'x-api-key'
    const key = request.headers['x-api-key'];

    // 2. Pega a chave correta que salvamos no .env
    const validKey = this.configService.get<string>('SUPER_ADMIN_API_KEY');

    // 3. Compara as duas
    if (key === validKey) {
      return true; // Acesso permitido
    }

    // 4. Acesso negado
    throw new UnauthorizedException('Chave de API inválida ou ausente.');
  }
}