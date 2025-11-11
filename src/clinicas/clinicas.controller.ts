// src/clinicas/clinicas.controller.ts
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
import { ClinicasService } from './clinicas.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { UpdateClinicaDto } from './dto/update-clinica.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';
import { ApiKeyGuard } from '../auth/api-key.guard'; // (Para o Super-Admin)

@Controller('clinicas')
export class ClinicasController {
  constructor(private readonly clinicasService: ClinicasService) {}

  // POST /clinicas
  // (Protegido pelo Super-Admin (você) com a Chave de API)
  @Post()
  @UseGuards(ApiKeyGuard) 
  create(@Body() createDto: CreateClinicaDto) {
    return this.clinicasService.create(createDto);
  }

  // PATCH /clinicas/:id
  // (Protegido pelo Admin da clínica)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateClinicaDto,
    @Request() req,
  ) {
    return this.clinicasService.update(id, updateDto, req.user);
  }

  // (Não precisamos dos outros endpoints (GET, DELETE) por enquanto)
}