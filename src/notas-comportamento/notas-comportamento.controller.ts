// src/notas-comportamento/notas-comportamento.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { NotasComportamentoService } from './notas-comportamento.service';
import { CreateNotaComportamentoDto } from './dto/create-nota-comportamento.dto';
import { UpdateNotaComportamentoDto } from './dto/update-notas-comportamento.dto';
import { QueryNotaComportamentoDto } from './dto/query-nota-comportamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('notas-comportamento')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotasComportamentoController {
  constructor(private readonly service: NotasComportamentoService) {}

  @Post()
  @Roles(NomePapel.COORDENADOR, NomePapel.ADMINISTRADOR) // Quem pode criar
  create(
    @Body() createDto: CreateNotaComportamentoDto,
    @Request() req,
  ) {
    return this.service.create(createDto, req.user);
  }

  @Get()
  @Roles( // Todos os papéis clínicos podem ver ("que todos possam ver")
    NomePapel.ADMINISTRADOR,
    NomePapel.COORDENADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
    NomePapel.PSICOLOGO,
    NomePapel.TERAPEUTA,
  )
  findAll(
    @Query() query: QueryNotaComportamentoDto, // O DTO de Query
    @Request() req,
  ) {
    return this.service.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.COORDENADOR)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.COORDENADOR, NomePapel.ADMINISTRADOR) // Quem pode editar
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateNotaComportamentoDto,
    @Request() req,
  ) {
    return this.service.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admins podem apagar (regra de negócio)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user);
  }
}