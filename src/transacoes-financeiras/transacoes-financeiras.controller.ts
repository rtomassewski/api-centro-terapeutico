// src/transacoes-financeiras/transacoes-financeiras.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { TransacoesFinanceirasService } from './transacoes-financeiras.service';
import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';
import { QueryTransacaoFinanceiraDto } from './dto/query-transacao-financeira.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { LicencaGuard } from '../auth/guards/licenca.guard';
import { Planos } from '../auth/decorators/planos.decorator';
import { NomePapel, TipoPlano } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('transacoes-financeiras')
@UseGuards(JwtAuthGuard, RolesGuard, LicencaGuard) // Guarda de Licença está aqui
export class TransacoesFinanceirasController {
  constructor(
    private readonly service: TransacoesFinanceirasService,
  ) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR)
  @Planos(TipoPlano.PRO, TipoPlano.ENTERPRISE, TipoPlano.TESTE) // <-- CORREÇÃO
  create(
    @Body() createDto: CreateTransacaoFinanceiraDto,
    @Request() req,
  ) {
    return this.service.create(createDto, req.user);
  }

  @Get()
  @Roles(NomePapel.ADMINISTRADOR)
  @Planos(TipoPlano.PRO, TipoPlano.ENTERPRISE, TipoPlano.TESTE) // <-- CORREÇÃO
  findAll(
    @Query() query: QueryTransacaoFinanceiraDto,
    @Request() req,
  ) {
    return this.service.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR)
  @Planos(TipoPlano.PRO, TipoPlano.ENTERPRISE, TipoPlano.TESTE) // <-- CORREÇÃO
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR)
  @Planos(TipoPlano.PRO, TipoPlano.ENTERPRISE, TipoPlano.TESTE) // <-- CORREÇÃO
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTransacaoFinanceiraDto,
    @Request() req,
  ) {
    return this.service.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR)
  @Planos(TipoPlano.PRO, TipoPlano.ENTERPRISE, TipoPlano.TESTE) // <-- CORREÇÃO
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user);
  }
}