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
import { AdministrarMedicamentoDto } from './dto/administrar-medicamento.dto';
import { QueryAdministracaoMedicamentoDto } from './dto/query-administracao-medicamento.dto';

// --- Imports de Segurança ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator'; // Verifique se o caminho do decorator está correto
import { NomePapel } from '@prisma/client';

@Controller('administracao-medicamentos')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class AdministracaoMedicamentosController {
  constructor(
    private readonly service: AdministracaoMedicamentosService,
  ) {}

  // 1. Aprazar (Criar horário): Apenas Enfermeiro e Admin
  // Técnico executa, mas geralmente quem planeja o horário é o Enfermeiro
  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) 
  create(
    @Body() createDto: CreateAdministracaoMedicamentoDto,
    @Request() req,
  ) {
    return this.service.create(createDto, req.user);
  }

  // 2. Administrar (Dar baixa): Técnico PODE e DEVE fazer isso
  @Patch(':id/administrar') 
  @Roles(
    NomePapel.ENFERMEIRO, 
    NomePapel.TECNICO, // <--- Isso permite o técnico dar baixa
    NomePapel.ADMINISTRADOR
  ) 
  administrar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdministrarMedicamentoDto,
    @Request() req,
  ) {
    return this.service.administrar(id, dto, req.user);
  }

  // 3. Listar (Ver a lista): Técnico PRECISA ver para saber o que fazer
  @Get()
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO, // <--- Isso corrige o erro 403 na listagem
    NomePapel.MEDICO,
  )
  findAll(
    @Request() req,
    @Query() query: QueryAdministracaoMedicamentoDto, 
  ) {
    return this.service.findAll(query, req.user);
  }

  // 4. Ver detalhes de um medicamento específico
  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO, // <--- Técnico também pode ver detalhes
    NomePapel.MEDICO,
  )
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.service.findOne(id, req.user);
  }
}