// src/entradas-estoque/entradas-estoque.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EntradasEstoqueService } from './entradas-estoque.service';
import { CreateEntradaEstoqueDto } from './dto/create-entradas-estoque.dto';
import { QueryEntradaEstoqueDto } from './dto/query-entrada-estoque.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
// + 1. Imports Adicionados
import { LicencaGuard } from '../auth/guards/licenca.guard';
import { Planos } from '../auth/decorators/planos.decorator';
import { NomePapel, TipoPlano } from '@prisma/client';

@Controller('entradas-estoque')
@UseGuards(JwtAuthGuard, RolesGuard, LicencaGuard) // + 2. Adicionado LicencaGuard
export class EntradasEstoqueController {
  constructor(
    private readonly entradasEstoqueService: EntradasEstoqueService,
  ) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE) // + 3. Tranca de Plano
  create(
    @Body() createDto: CreateEntradaEstoqueDto,
    @Request() req,
  ) {
    return this.entradasEstoqueService.create(createDto, req.user);
  }

  @Get()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE) // + 3. Tranca de Plano
  findAll(
    @Request() req,
    @Query() query: QueryEntradaEstoqueDto,
  ) {
    return this.entradasEstoqueService.findAll(query, req.user);
  }
}