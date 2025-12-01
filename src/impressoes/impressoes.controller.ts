// src/impressoes/impressoes.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { ImpressoesService } from './impressoes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';
import type { Response } from 'express';

@Controller('impressoes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImpressoesController {
  constructor(private readonly impressoesService: ImpressoesService) {}

  // --- ROTA 1: PRONTUÁRIO ---
  @Get('paciente/:id/prontuario') // URL Final: /impressoes/paciente/1/prontuario
  @Roles(
    NomePapel.MEDICO,
    NomePapel.ADMINISTRADOR,
    NomePapel.COORDENADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.PSICOLOGO,
    NomePapel.TERAPEUTA,
    NomePapel.TECNICO
  )
  async getProntuarioPdf(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Request() req,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.impressoesService.gerarProntuarioPdf(
      pacienteId,
      req.user,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="prontuario_${pacienteId}.pdf"`,
    });

    res.end(pdfBuffer);
  }

  // --- ROTA 2: RELATÓRIO FINANCEIRO ---
  @Get('financeiro') // URL Final: /impressoes/financeiro
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR)
  async getRelatorioFinanceiro(
    @Request() req,
    @Res() res: Response,
    @Query('inicio') inicio?: string,
    @Query('fim') fim?: string,
  ) {
    // Validação básica para evitar erro se esquecer datas
    const pdfBuffer = await this.impressoesService.gerarRelatorioFinanceiro(
      req.user,
      inicio,
      fim,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="relatorio_financeiro.pdf"`,
    });

    res.end(pdfBuffer);
  }
}