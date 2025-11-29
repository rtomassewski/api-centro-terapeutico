// src/usuarios/usuarios.controller.ts
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
  Request
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get('papeis/todos')
  listarPapeis() {
    return this.usuariosService.findAllPapeis();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // --- AQUI ESTÁ A CORREÇÃO: ADICIONAMOS TODO MUNDO ---
  @Roles(
    NomePapel.ADMINISTRADOR, 
    NomePapel.ATENDENTE,
    NomePapel.ATENDENTE, // Caso usem nomes diferentes
    NomePapel.MEDICO,
    NomePapel.DENTISTA,      // <--- O que faltava
    NomePapel.PSICOLOGO,     // <--- O que faltava
    NomePapel.TERAPEUTA,     // <--- O que faltava
    NomePapel.PSIQUIATRA,    // <--- O que faltava
    NomePapel.ENFERMEIRO,    // <--- O que faltava
    NomePapel.NUTRICIONISTA,
    NomePapel.FISIOTERAPEUTA
  )
  // ---------------------------------------------------
  findAll(@Request() req) {
    return this.usuariosService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    NomePapel.ADMINISTRADOR, 
    NomePapel.ATENDENTE,
    NomePapel.DENTISTA, // Importante para o perfil
    NomePapel.MEDICO,
    NomePapel.PSICOLOGO
  )
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usuariosService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR) // Atualizar, só o admin ou o próprio user (logica no service)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usuariosService.remove(id, req.user);
  }
}