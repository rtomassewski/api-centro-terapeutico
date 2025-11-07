// src/leitos/leitos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query, // 1. Adicione
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LeitosService } from './leitos.service';
import { CreateLeitoDto } from './dto/create-leito.dto';
import { UpdateLeitoDto } from './dto/update-leito.dto';
import { QueryLeitoDto } from './dto/query-leito.dto'; // 2. Adicione
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('leitos')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class LeitosController {
  constructor(private readonly leitosService: LeitosService) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode criar
  create(@Body() createDto: CreateLeitoDto, @Request() req) {
    return this.leitosService.create(createDto, req.user);
  }

  @Get()
  @Roles( // Todos os papéis clínicos podem ver
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findAll(
    @Request() req,
    @Query() query: QueryLeitoDto, // 3. Pega os filtros
  ) {
    return this.leitosService.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.leitosService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode editar
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLeitoDto,
    @Request() req,
  ) {
    return this.leitosService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode remover
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.leitosService.remove(id, req.user);
  }
}