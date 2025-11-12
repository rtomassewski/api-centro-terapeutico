// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto'; // 4. Importe
import { JwtAuthGuard } from './jwt-auth.guard'; //
import { CreateTrialDto } from './dto/create-trial.dto';

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
  @Patch('meu-perfil')
  @UseGuards(JwtAuthGuard) // 6. Proteja! Apenas usuários logados
  async updatePerfil(
    @Request() req, // 7. Pega o usuário do token
    @Body() dto: UpdatePerfilDto, // 8. Pega o formulário
  ) {
    const userId = req.user.id; // Pega o ID do usuário logado
    return this.authService.updatePerfil(userId, dto);
  }
  @Post('register-trial') // Rota PÚBLICA
  async registerTrial(@Body() dto: CreateTrialDto) {
    // (Não tem @UseGuards, qualquer um pode chamar)
    return this.authService.createTrial(dto);
  }
}
