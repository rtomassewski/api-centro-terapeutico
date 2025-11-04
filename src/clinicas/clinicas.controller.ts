import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClinicasService } from './clinicas.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { UpdateClinicaDto } from './dto/update-clinica.dto';

@Controller('clinicas')
export class ClinicasController {
  constructor(private readonly clinicasService: ClinicasService) {}

  @Post()
  create(@Body() createClinicaDto: CreateClinicaDto) {
    return this.clinicasService.create(createClinicaDto);
  }

}
