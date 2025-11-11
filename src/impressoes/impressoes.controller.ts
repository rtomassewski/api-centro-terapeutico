// src/impressoes/impressoes.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ImpressoesService } from './impressoes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';
import type { Response } from 'express'; // Importe o 'Response' do Express

@Controller('impressoes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ImpressoesController {
  constructor(private readonly impressoesService: ImpressoesService) {}

  @Get('paciente/:id/prontuario')
  @Roles(NomePapel.MEDICO, NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR)
  async getProntuarioPdf(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Request() req,
    @Res() res: Response, // 1. Injete o objeto de Resposta
  ) {
    // 2. Chama o service, que retorna um Buffer (o PDF)
    const pdfBuffer = await this.impressoesService.gerarProntuarioPdf(
      pacienteId,
      req.user,
    );

    // 3. Define os Headers da Resposta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      // (Opcional) Força o download em vez de abrir no navegador
      'Content-Disposition': `attachment; filename="prontuario_${pacienteId}.pdf"`,
    });

    // 4. Envia o PDF
    res.end(pdfBuffer);
  }
}