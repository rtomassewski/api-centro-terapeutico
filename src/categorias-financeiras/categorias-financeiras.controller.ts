// src/categorias-financeiras/categorias-financeiras.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CategoriasFinanceirasService } from './categorias-financeiras.service';
import { CreateCategoriaFinanceiraDto } from './dto/create-categoria-financeira.dto';
import { UpdateCategoriaFinanceiraDto } from './dto/update-categoria-financeira.dto';

// --- Imports de Segurança ---
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

// --- SEGURANÇA: Tranca o Controller inteiro ---
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(NomePapel.ADMINISTRADOR)
@Controller('categorias-financeiras')
export class CategoriasFinanceirasController {
  constructor(
    private readonly service: CategoriasFinanceirasService,
  ) {}

  @Post()
  create(@Body() dto: CreateCategoriaFinanceiraDto, @Request() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaFinanceiraDto,
    @Request() req,
  ) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user);
  }
}