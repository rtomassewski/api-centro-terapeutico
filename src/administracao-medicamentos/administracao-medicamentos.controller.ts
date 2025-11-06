// src/administracao-medicamentos/administracao-medicamentos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  Query
} from '@nestjs/common';
import { AdministracaoMedicamentosService } from './administracao-medicamentos.service';
import { CreateAdministracaoMedicamentoDto } from './dto/create-administracao-medicamento.dto';
import { UpdateAdministracaoMedicamentoDto } from './dto/update-administracao-medicamento.dto';
import { AdministrarMedicamentoDto } from './dto/administrar-medicamento.dto';
import { QueryAdministracaoMedicamentoDto } from './dto/query-administracao-medicamento.dto';

// --- Imports de Segurança ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('administracao-medicamentos')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class AdministracaoMedicamentosController {
  constructor(
    private readonly service: AdministracaoMedicamentosService,
  ) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Apenas estes papéis podem aprazar
  create(
    @Body() createDto: CreateAdministracaoMedicamentoDto,
    @Request() req,
  ) {
    return this.service.create(createDto, req.user);
  }

  @Patch(':id/administrar') // Rota customizada
  @Roles(NomePapel.ENFERMEIRO, NomePapel.TECNICO) // 5. Apenas Enfermagem pode administrar
  administrar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdministrarMedicamentoDto,
    @Request() req,
  ) {
    return this.service.administrar(id, dto, req.user);
  }

  @Get()
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findAll(
    @Request() req,
    @Query() query: QueryAdministracaoMedicamentoDto, // 4. Pega os filtros
  ) {
    return this.service.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.service.findOne(id, req.user);
  }
/*
  @Patch(':id')
  update(...) { ... }

  @Delete(':id')
  remove(...) { ... }
  */
}