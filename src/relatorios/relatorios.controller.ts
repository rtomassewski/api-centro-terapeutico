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
import { LicencaGuard } from '../auth/guards/licenca.guard';
import { Planos } from '../auth/decorators/planos.decorator';
import { NomePapel, TipoPlano } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('relatorios')
@UseGuards(JwtAuthGuard, RolesGuard, LicencaGuard) // Guarda de Licença está aqui
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('dashboard')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR)
  @Planos(
    TipoPlano.PRO, 
    TipoPlano.ENTERPRISE, 
    TipoPlano.TESTE // <-- CORREÇÃO: Adicionado o plano TESTE
  )
  getDashboard(@Request() req) {
    return this.relatoriosService.getDashboard(req.user);
  }
}