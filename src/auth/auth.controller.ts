// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Rota: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // Rota: POST /auth/login
  async login(@Body() loginDto: LoginDto) {
    // O DTO (que vamos criar) valida o body
    const usuario = await this.authService.validateUser(
      loginDto.email,
      loginDto.senha,
    );
    
    // Se o usuário for válido, o serviço de login gera o token
    return this.authService.login(usuario);
  }
}
