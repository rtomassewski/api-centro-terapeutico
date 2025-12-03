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
  Query, // <--- Importante para o filtro
  ParseIntPipe,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LicencaGuard } from '../auth/guards/licenca.guard';
import { Planos } from '../auth/decorators/planos.decorator';
import { NomePapel, TipoPlano } from '@prisma/client';

@Controller('produtos')
@UseGuards(JwtAuthGuard, RolesGuard, LicencaGuard)
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE)
  create(@Body() createDto: CreateProdutoDto, @Request() req) {
    // O createDto já deve conter o campo 'tipo' (FARMACIA ou LOJA)
    return this.produtosService.create(createDto, req.user);
  }

  @Get()
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE)
  findAll(
    @Request() req,
    @Query('tipo') tipo?: string // <--- ADICIONADO: Recebe ?tipo=LOJA ou ?tipo=FARMACIA
  ) {
    // Repassa o filtro para o serviço
    return this.produtosService.findAll(req.user, tipo);
  }

  @Get(':id')
  @Roles(
    NomePapel.ADMINISTRADOR,
    NomePapel.ENFERMEIRO,
    NomePapel.TECNICO,
    NomePapel.MEDICO,
  )
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.produtosService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(NomePapel.ADMINISTRADOR, NomePapel.ENFERMEIRO)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProdutoDto,
    @Request() req,
  ) {
    return this.produtosService.update(id, updateDto, req.user);
  }

  @Delete(':id')
  @Roles(NomePapel.ADMINISTRADOR)
  @Planos(TipoPlano.ENTERPRISE, TipoPlano.TESTE)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.produtosService.remove(id, req.user);
  }
}