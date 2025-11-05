// src/transacoes-financeiras/transacoes-financeiras.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransacoesFinanceirasService } from './transacoes-financeiras.service';
import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';

// --- Imports de Segurança ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

// --- SEGURANÇA: Tranca o Controller inteiro ---
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(NomePapel.ADMINISTRADOR)
@Controller('transacoes-financeiras')
export class TransacoesFinanceirasController {
  constructor(
    private readonly service: TransacoesFinanceirasService,
  ) {}

  @Post()
  create(@Body() dto: CreateTransacaoFinanceiraDto, @Request() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransacaoFinanceiraDto,
    @Request() req,
  ) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user);
  }
}