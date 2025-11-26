import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { CreateProcedimentoDto } from './dto/create-procedimento.dto';
import { UpdateProcedimentoDto } from './dto/update-procedimento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Verifique se o caminho do seu Guard está correto

@Controller('procedimentos')
@UseGuards(JwtAuthGuard)
export class ProcedimentosController {
  constructor(private readonly procedimentosService: ProcedimentosService) {}

  @Post()
  create(@Body() createDto: CreateProcedimentoDto, @Request() req) {
    return this.procedimentosService.create(createDto, req.user.clinicaId);
  }

  @Get()
  findAll(@Request() req, @Query('ativos') ativos?: string) {
    // Se passar ?ativos=true na URL, filtra. Senão traz todos.
    const apenasAtivos = ativos === 'true';
    return this.procedimentosService.findAll(req.user.clinicaId, apenasAtivos);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.procedimentosService.findOne(+id, req.user.clinicaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProcedimentoDto, @Request() req) {
    return this.procedimentosService.update(+id, req.user.clinicaId, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.procedimentosService.remove(+id, req.user.clinicaId);
  }
}