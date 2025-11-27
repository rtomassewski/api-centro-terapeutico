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

// 1. A SEGURANÇA FOI REMOVIDA DO TOPO DA CLASSE
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // 2. O 'create' (POST) agora é PÚBLICO
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    // 3. A chamada do service foi simplificada (sem req.user)
    return this.usuariosService.create(createUsuarioDto);
  }
  @Get('papeis/todos')
  listarPapeis() {
    return this.usuariosService.findAllPapeis();
  }

  // 4. OS OUTROS MÉTODOS CONTINUAM PROTEGIDOS
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ATENDENTE)
  findAll(@Request() req) {
    return this.usuariosService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ATENDENTE)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usuariosService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(NomePapel.ADMINISTRADOR)
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