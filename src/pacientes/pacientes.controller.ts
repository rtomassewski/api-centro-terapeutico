import { PrescricoesService } from '../prescricoes/prescricoes.service';
import { CreatePrescricaoDto } from '../prescricoes/dto/create-prescricao.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { NomePapel } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { EvolucoesService } from '../evolucoes/evolucoes.service';
import { CreateEvolucaoDto } from '../evolucoes/dto/create-evolucao.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from '@nestjs/common';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService,
              private readonly evolucoesService: EvolucoesService,
              private readonly prescricoesService: PrescricoesService,)
 {}

@Post()
  @UseGuards(JwtAuthGuard) // 4. Proteja a rota
  create(
    @Body() createPacienteDto: CreatePacienteDto,
    @Request() req, // 5. Receba a requisição
  ) {
    // 6. Passe o 'req.user' (que contém o clinicaId) para o serviço
    return this.pacientesService.create(createPacienteDto, req.user);
  }

@Post(':id/evolucoes')
  @UseGuards(JwtAuthGuard)
  async createEvolucao(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Body() dto: CreateEvolucaoDto,
    @Request() req,
  ) {
    // 'req.user' é o objeto 'usuarioLogado' completo
    return this.evolucoesService.create(
      dto,
      pacienteId,
      req.user, // 1. Passe o objeto 'req.user' inteiro
    );
  }
@Get(':id/evolucoes')
  @UseGuards(JwtAuthGuard)
  async findEvolucoes(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Request() req, // 2. Adicione o @Request()
  ) {
    return this.evolucoesService.findAllByPaciente(
      pacienteId,
      req.user, // 3. Passe o objeto 'req.user' inteiro
    );
  }
@Post(':id/prescricoes')
  @Roles(NomePapel.MEDICO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createPrescricao(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Body() dto: CreatePrescricaoDto,
    @Request() req,
  ) {
    // NÃO defina 'usuarioLogadoId'
    // Passe o 'req.user' inteiro
    return this.prescricoesService.create( // <-- Esta é a sua linha 65
      dto,
      pacienteId,
      req.user, // <-- A chamada CORRETA
    );
  }

  @Get(':id/prescricoes')
  @UseGuards(JwtAuthGuard)
  async findPrescricoes(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Request() req, // 2. Adicione o @Request()
  ) {
    return this.prescricoesService.findAllByPaciente(
      pacienteId,
      req.user, // 3. Passe o objeto 'req.user' inteiro
    );
  }
}

