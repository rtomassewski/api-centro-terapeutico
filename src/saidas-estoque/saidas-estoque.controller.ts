// src/saidas-estoque/saidas-estoque.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query, // 1. Adicione
  UseGuards,
  Request,
} from '@nestjs/common';
import { SaidasEstoqueService } from './saidas-estoque.service';
import { CreateSaidaEstoqueDto } from './dto/create-saidas-estoque.dto';
import { QuerySaidaEstoqueDto } from './dto/query-saida-estoque.dto'; // 2. Adicione
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('saidas-estoque')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SaidasEstoqueController {
  constructor(
    private readonly saidasEstoqueService: SaidasEstoqueService,
  ) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Quem pode dar saída
  create(
    @Body() createDto: CreateSaidaEstoqueDto,
    @Request() req,
  ) {
    return this.saidasEstoqueService.create(createDto, req.user);
  }

  @Get()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Quem pode auditar
  findAll(
    @Request() req,
    @Query() query: QuerySaidaEstoqueDto, // 3. Pega os filtros
  ) {
    return this.saidasEstoqueService.findAll(query, req.user);
  }

  // Note: Removemos GET /:id, PATCH /:id e DELETE /:id
}