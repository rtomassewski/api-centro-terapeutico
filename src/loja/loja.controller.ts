// src/loja/loja.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LojaService } from './loja.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// Importe seus Guards de licença/role se precisar

@Controller('loja')
@UseGuards(JwtAuthGuard) // Protege todas as rotas
export class LojaController {
  constructor(private readonly lojaService: LojaService) {}

  // Rota: POST /loja/credito
  @Post('credito')
  async adicionarCredito(@Body() body: { pacienteId: number; valor: number }, @Request() req) {
    return this.lojaService.adicionarCredito(body, req.user);
  }

  // Rota: POST /loja/venda
  @Post('venda')
  async realizarVenda(@Body() body: { pacienteId: number; itens: any[] }, @Request() req) {
    return this.lojaService.realizarVenda(body, req.user);
  }
}