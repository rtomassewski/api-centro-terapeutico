// src/entradas-estoque/entradas-estoque.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query, // 1. Adicione
  UseGuards,
  Request,
} from '@nestjs/common';
import { EntradasEstoqueService } from './entradas-estoque.service';
import { CreateEntradaEstoqueDto } from './dto/create-entradas-estoque.dto';
import { QueryEntradaEstoqueDto } from './dto/query-entrada-estoque.dto'; // 2. Adicione
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('entradas-estoque')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntradasEstoqueController {
  constructor(
    private readonly entradasEstoqueService: EntradasEstoqueService,
  ) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Quem pode dar entrada
  create(
    @Body() createDto: CreateEntradaEstoqueDto,
    @Request() req,
  ) {
    return this.entradasEstoqueService.create(createDto, req.user);
  }

  @Get()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Quem pode auditar
  findAll(
    @Request() req,
    @Query() query: QueryEntradaEstoqueDto, // 3. Pega os filtros
  ) {
    return this.entradasEstoqueService.findAll(query, req.user);
  }

  // Note: Removemos GET /:id, PATCH /:id e DELETE /:id
}