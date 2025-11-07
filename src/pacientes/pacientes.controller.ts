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
import { CheckInPacienteDto } from './dto/check-in-paciente.dto'; 



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
  
  @Get() // Rota: GET /pacientes
  @UseGuards(JwtAuthGuard) // 2. Proteja a rota
  findAll(
    @Request() req, // 3. Pegue o usuário logado
  ) {
    return this.pacientesService.findAll(req.user);
  }

  @Get(':id') // Rota: GET /pacientes/1
  @UseGuards(JwtAuthGuard) // 2. Proteja a rota
  findOne(
    @Param('id', ParseIntPipe) pacienteId: number, // 3. Pega o ID da URL
    @Request() req, // 4. Pega o usuário logado
  ) {
    return this.pacientesService.findOne(pacienteId, req.user);
  }

  @Patch(':id') // Rota: PATCH /pacientes/1
  @UseGuards(JwtAuthGuard) // 3. Proteja a rota
  update(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Body() updatePacienteDto: UpdatePacienteDto, // 4. Pega o DTO
    @Request() req, // 5. Pega o usuário
  ) {
    return this.pacientesService.update(
      pacienteId,
      updatePacienteDto,
      req.user,
    );
  }
  @Patch(':id/check-in')
  @UseGuards(JwtAuthGuard, RolesGuard) // 5. Proteja
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // 6. Defina quem pode
  checkIn(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Body() dto: CheckInPacienteDto,
    @Request() req,
  ) {
    return this.pacientesService.checkIn(pacienteId, dto, req.user);
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
    // --- CORREÇÃO AQUI ---
    const usuarioLogadoId = req.user.id; // 1. Pegue o ID (o Número)

    return this.prescricoesService.create(
      dto,
      pacienteId,
      usuarioLogadoId, // 2. Passe o ID (o Número)
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

