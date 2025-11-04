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

@Post(':id/evolucoes') // Rota: POST /pacientes/1/evolucoes
  @UseGuards(JwtAuthGuard) // 4. PROTEJA A ROTA!
  async createEvolucao(
    @Param('id', ParseIntPipe) pacienteId: number, // 5. Pega o ID do paciente da URL
    @Body() dto: CreateEvolucaoDto, // 6. Pega o JSON do body
    @Request() req, // 7. Pega a requisição (que contém o usuário logado)
  ) {
    // 8. O 'req.user' foi injetado pela JwtStrategy (Passo 8.1)
    const usuarioLogadoId = req.user.id; 

    return this.evolucoesService.create(
      dto,
      pacienteId,
      usuarioLogadoId,
    );
  }
@Get(':id/evolucoes') // Rota: GET /pacientes/1/evolucoes
  @UseGuards(JwtAuthGuard) // 1. PROTEJA A ROTA!
  async findEvolucoes(
    @Param('id', ParseIntPipe) pacienteId: number, // 2. Pega o ID da URL
  ) {
    // 3. Chama o serviço que acabamos de criar
    return this.evolucoesService.findAllByPaciente(pacienteId);
  }
@Post(':id/prescricoes')
  @Roles(NomePapel.MEDICO) // 3. APENAS MÉDICOS!
  @UseGuards(JwtAuthGuard, RolesGuard) // 4. Use AMBOS os guardas
  async createPrescricao(
    @Param('id', ParseIntPipe) pacienteId: number,
    @Body() dto: CreatePrescricaoDto,
    @Request() req,
  ) {
    const usuarioLogadoId = req.user.id;
    return this.prescricoesService.create(
      dto,
      pacienteId,
      usuarioLogadoId,
    );
  }

  @Get(':id/prescricoes')
  @UseGuards(JwtAuthGuard) // 5. Todos logados podem ver
  async findPrescricoes(
    @Param('id', ParseIntPipe) pacienteId: number,
  ) {
    return this.prescricoesService.findAllByPaciente(pacienteId);
  }
}

