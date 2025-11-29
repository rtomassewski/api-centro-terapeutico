// src/caixas/caixas.controller.ts
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CaixasService } from './caixas.service';
import { AbrirCaixaDto } from './dto/abrir-caixa.dto';
import { FecharCaixaDto } from './dto/fechar-caixa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('caixas')
@UseGuards(JwtAuthGuard) // Só usuário logado mexe no caixa
export class CaixasController {
  constructor(private readonly caixasService: CaixasService) {}

  @Get('status/hoje')
  verificarStatus(@Request() req) {
    // Pega o ID do usuário pelo Token JWT
    return this.caixasService.verificarStatusHoje(req.user.id);
  }

  @Post('abrir')
  abrir(@Body() dto: AbrirCaixaDto, @Request() req) {
    return this.caixasService.abrir(req.user.id, req.user.clinicaId, dto);
  }

  @Post('fechar')
  fechar(@Body() dto: FecharCaixaDto, @Request() req) {
    return this.caixasService.fechar(req.user.id, dto);
  }
}