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
              private readonly evolucoesService: EvolucoesService) {}

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
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
}
