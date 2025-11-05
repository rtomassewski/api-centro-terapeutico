// src/agendamentos/agendamentos.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // 1. Protegido por login
  create(@Body() createDto: CreateAgendamentoDto, @Request() req) {
    // 2. Passa o DTO e o usuário logado (para pegar o clinicaId)
    return this.agendamentosService.create(createDto, req.user);
  }

  // (Deixe os outros métodos gerados pelo CLI comentados por enquanto)
 @Get()
  @UseGuards(JwtAuthGuard) // 4. Protegido por login
  findAll(
    @Query() query: QueryAgendamentoDto, // 5. Pega os filtros da URL
    @Request() req,
  ) {
    // 6. O 'ValidationPipe' (em main.ts) já validou e transformou os filtros
    return this.agendamentosService.findAll(query, req.user);
  }
@Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.agendamentosService.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAgendamentoDto,
    @Request() req,
  ) {
    return this.agendamentosService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.agendamentosService.remove(id, req.user);
  }
}