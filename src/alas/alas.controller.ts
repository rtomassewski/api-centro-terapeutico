// src/alas/alas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AlasService } from './alas.service';
import { CreateAlaDto } from './dto/create-ala.dto';
import { UpdateAlaDto } from './dto/update-ala.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('alas')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class AlasController {
  constructor(private readonly alasService: AlasService) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode criar
  create(@Body() createDto: CreateAlaDto, @Request() req) {
    return this.alasService.create(createDto, req.user);
  }

  @Get()
  @Roles( // Todos os papéis clínicos podem ver o mapa
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findAll(@Request() req) {
    return this.alasService.findAll(req.user);
  }

  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.alasService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode editar
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAlaDto,
    @Request() req,
  ) {
    return this.alasService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas Admin pode remover
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.alasService.remove(id, req.user);
  }
}