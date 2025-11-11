// src/saidas-estoque/saidas-estoque.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SaidasEstoqueService } from './saidas-estoque.service';
import { CreateSaidaEstoqueDto } from './dto/create-saidas-estoque.dto';
import { QuerySaidaEstoqueDto } from './dto/query-saida-estoque.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
// + 1. Imports Adicionados
import { LicencaGuard } from '../auth/guards/licenca.guard';
import { Planos } from '../auth/decorators/planos.decorator';
import { NomePapel, TipoPlano } from '@prisma/client';

@Controller('saidas-estoque')
@UseGuards(JwtAuthGuard, RolesGuard, LicencaGuard) // + 2. Adicionado LicencaGuard
export class SaidasEstoqueController {
  constructor(
    private readonly saidasEstoqueService: SaidasEstoqueService,
  ) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE) // + 3. Tranca de Plano
  create(
    @Body() createDto: CreateSaidaEstoqueDto,
    @Request() req,
  ) {
    return this.saidasEstoqueService.create(createDto, req.user);
  }

  @Get()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE) // + 3. Tranca de Plano
  findAll(
    @Request() req,
    @Query() query: QuerySaidaEstoqueDto,
  ) {
    return this.saidasEstoqueService.findAll(query, req.user);
  }
}