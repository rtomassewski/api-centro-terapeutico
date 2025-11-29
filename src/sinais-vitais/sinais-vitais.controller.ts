// src/sinais-vitais/sinais-vitais.controller.ts
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
import { SinaisVitaisService } from './sinais-vitais.service';
import { CreateSinalVitalDto } from './dto/create-sinal-vital.dto';
import { UpdateSinalVitalDto } from './dto/update-sinal-vital.dto';
import { QuerySinalVitalDto } from './dto/query-sinal-vital.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('sinais-vitais')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SinaisVitaisController {
  constructor(private readonly service: SinaisVitaisService) {}

  @Post()
  @Roles(NomePapel.ENFERMEIRO, NomePapel.TECNICO, NomePapel.MEDICO) // OK: Técnico pode lançar
  create(
    @Body() createDto: CreateSinalVitalDto,
    @Request() req,
  ) {
    return this.service.create(createDto, req.user);
  }

  @Get()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO, NomePapel.TECNICO, NomePapel.MEDICO) // OK: Técnico pode ver
  findAll(
    @Query() query: QuerySinalVitalDto,
    @Request() req,
  ) {
    return this.service.findAll(query, req.user);
  }

  @Get(':id')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO, NomePapel.TECNICO, NomePapel.MEDICO)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(
    NomePapel.ENFERMEIRO, 
    NomePapel.MEDICO, 
    NomePapel.ADMINISTRADOR,
    NomePapel.TECNICO // <--- RECOMENDADO: Adicionei aqui para ele poder corrigir erros
  ) 
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSinalVitalDto,
    @Request() req,
  ) {
    return this.service.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ENFERMEIRO, NomePapel.ADMINISTRADOR) // Mantido bloqueado para técnico (Segurança)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user);
  }
}