// src/quartos/quartos.controller.ts
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
import { QuartosService } from './quartos.service';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { QueryQuartoDto } from './dto/query-quarto.dto'; // 2. Adicione
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('quartos')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class QuartosController {
  constructor(private readonly quartosService: QuartosService) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode criar
  create(@Body() createDto: CreateQuartoDto, @Request() req) {
    return this.quartosService.create(createDto, req.user);
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
    @Query() query: QueryQuartoDto, // 3. Pega os filtros (alaId)
  ) {
    return this.quartosService.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.quartosService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode editar
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateQuartoDto,
    @Request() req,
  ) {
    return this.quartosService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode remover
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.quartosService.remove(id, req.user);
  }
}