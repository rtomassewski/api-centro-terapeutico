// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PrismaService } from '../prisma.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    // Precisamos "importar" o módulo de usuários para usarmos o service dele
    UsuariosModule, 
    JwtModule.register({
      // ATENÇÃO: Mude esta chave para algo secreto e único!
      // Não deixe "secret" em produção.
      secret: 'MINHA_CHAVE_SECRETA_SUPER_SEGURA_123456', 
      signOptions: { expiresIn: '8h' }, // Token expira em 8 horas
    }),
  ],
  providers: [
    AuthService,
    // Precisamos do PrismaService e do UsuariosService para a lógica de login
    PrismaService, 
    UsuariosService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
