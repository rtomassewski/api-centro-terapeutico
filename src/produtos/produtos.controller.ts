// src/produtos/produtos.controller.ts
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
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NomePapel } from '@prisma/client';

@Controller('produtos')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas as rotas
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Apenas estes podem criar
  create(
    @Body() createDto: CreateProdutoDto,
    @Request() req,
  ) {
    return this.produtosService.create(createDto, req.user);
  }

  @Get()
  @Roles( // Todos os papéis clínicos podem ver o catálogo
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findAll(@Request() req) {
    return this.produtosService.findAll(req.user);
  }

  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.produtosService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO) // Apenas estes podem editar
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProdutoDto,
    @Request() req,
  ) {
    return this.produtosService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR) // Apenas ADMINS podem remover
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.produtosService.remove(id, req.user);
  }
}