// src/evolucoes/evolucoes.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Req // <-- Certifique-se de importar o Req
} from '@nestjs/common';
import { EvolucoesService } from './evolucoes.service';
import { CreateEvolucaoDto } from './dto/create-evolucao.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('evolucoes')
@UseGuards(AuthGuard('jwt'))
export class EvolucoesController {
  constructor(private readonly evolucoesService: EvolucoesService) {}

  @Post()
  create(@Body() createEvolucaoDto: CreateEvolucaoDto, @Req() req: any) {
    // CORREÇÃO: Passamos 3 argumentos agora:
    // 1. O DTO
    // 2. O ID do paciente (extraído do DTO)
    // 3. O Usuário logado (para validar sigilo)
    return this.evolucoesService.create(
      createEvolucaoDto, 
      createEvolucaoDto.pacienteId, 
      req.user
    );
  }

  @Get('paciente/:id')
  findAllByPaciente(@Param('id') id: string, @Req() req: any) {
    // CORREÇÃO: Passamos 2 argumentos:
    // 1. ID do paciente
    // 2. Usuário logado (para filtrar o que ele pode ver)
    return this.evolucoesService.findAllByPaciente(+id, req.user);
  }
}