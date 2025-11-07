// src/relatorios/relatorios.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('relatorios')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('dashboard')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR) // Apenas gestores veem
  getDashboard(@Request() req) {
    return this.relatoriosService.getDashboard(req.user);
  }
}