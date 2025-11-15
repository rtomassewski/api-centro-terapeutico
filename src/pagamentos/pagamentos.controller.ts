// src/pagamentos/pagamentos.controller.ts
import { Controller, Post, Body, UseGuards, Request, HttpCode,Patch, Param, ParseIntPipe, } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { SuperUpdateLicencaDto } from './dto/super-update-licenca.dto';

@Controller()
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  /**
   * Endpoint para um admin da clínica iniciar um checkout
   */
  @Post('checkout')
  // Protegido por Login
  @UseGuards(JwtAuthGuard, RolesGuard) 
  // Protegido por Papel (ex: só o Admin da clínica pode pagar)
  @Roles(NomePapel.ADMINISTRADOR) 
  async createCheckout(
    @Request() req,
  ) {
    // req.user contém o usuário logado (incluindo clinicaId)
    return this.pagamentosService.criarCheckout(req.user);
  }
@Post('webhook')
  @HttpCode(200) // 2. Responda 200 OK (e não 201 Created)
  async receberWebhook(@Body() notificacao: any) {
    // 3. Este endpoint é PÚBLICO (sem guardas)
    // O Mercado Pago que o chama.
    return this.pagamentosService.processarWebhook(notificacao);
  }
  @Patch('licencas/:id') // A Rota que faltava!
  @UseGuards(ApiKeyGuard) // 7. Protegido pela sua chave de Super-Admin
  async superUpdateLicenca(
    @Param('id', ParseIntPipe) licencaId: number,
    @Body() dto: SuperUpdateLicencaDto,
  ) {
    return this.pagamentosService.superUpdateLicenca(licencaId, dto);
  }
}