// src/agendamentos/agendamentos.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get, Query, Param, ParseIntPipe, Patch, } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto'; // Importe o DTO de update
import { QueryAgendamentoDto } from './dto/query-agendamento.dto'; // Importe o DTO de query
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // Caminho corrigido
import { Roles } from '../auth/decorators/roles.decorator';
import { NomePapel } from '@prisma/client'; // Importa o ENUM NomePapel

@Controller('agendamentos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR, NomePapel.ATENDENTE)
  async create(
    @Body() createDto: CreateAgendamentoDto,
    @Request() req,
  ) {
    return this.agendamentosService.create(createDto, req.user);
  }

  @Get()
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.COORDENADOR,
    NomePapel.ATENDENTE,
    NomePapel.MEDICO,
    NomePapel.DENTISTA,
    NomePapel.NUTRICIONISTA,
    NomePapel.FISIOTERAPEUTA,
    NomePapel.PSIQUIATRA,
  )
  async findAll(
    @Query() query: QueryAgendamentoDto,
    @Request() req,
  ) {
    return this.agendamentosService.findAll(query, req.user);
  }
  
  // --- MÉTODO UPDATE CORRIGIDO ---
  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR, NomePapel.ATENDENTE)
  async update(
    @Param('id', ParseIntPipe) agendamentoId: number,
    @Request() req,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
  ) {
    return this.agendamentosService.update(
      agendamentoId,
      req.user.clinicaId,
      updateAgendamentoDto,
    );
  }

  // (Não há necessidade de 'findOne' ou 'remove' neste controlador para o MVP)
}