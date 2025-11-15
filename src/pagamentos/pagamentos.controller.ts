// src/pagamentos/pagamentos.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { SuperUpdateLicencaDto } from './dto/super-update-licenca.dto';
// (Importe o JwtAuthGuard se estiver em falta)
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// (Importe o Request se estiver em falta)
// import { Request } from '@nestjs/common';

// --- CORREÇÃO 1: Adicione o prefixo de volta ---
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  /**
   * Endpoint para um admin da clínica iniciar um checkout
   */
  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR)
  async createCheckout(@Request() req) {
    // (O seu código 'createCheckout' existente)
    // (No seu código colado era 'criarCheckout', certifique-se de que o nome do método está correto)
    return this.pagamentosService.criarCheckout(req.user); 
  }

  @Post('webhook')
  @HttpCode(200)
  async receberWebhook(@Body() notificacao: any) {
    // (O seu código 'receberWebhook' existente)
    return this.pagamentosService.processarWebhook(notificacao);
  }

  // --- CORREÇÃO 2: O endpoint de licença AGORA VIVE DENTRO DE /pagamentos ---
  @Patch('licencas/:id') // O URL real será: /pagamentos/licencas/:id
  @UseGuards(ApiKeyGuard) // Protegido pela sua chave de Super-Admin
  async superUpdateLicenca(
    @Param('id', ParseIntPipe) licencaId: number,
    @Body() dto: SuperUpdateLicencaDto,
  ) {
    return this.pagamentosService.superUpdateLicenca(licencaId, dto);
  }
}