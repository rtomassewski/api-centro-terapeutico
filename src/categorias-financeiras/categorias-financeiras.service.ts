// src/categorias-financeiras/categorias-financeiras.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCategoriaFinanceiraDto } from './dto/create-categoria-financeira.dto';
import { UpdateCategoriaFinanceiraDto } from './dto/update-categoria-financeira.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class CategoriasFinanceirasService {
  
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Verifica se a categoria pertence à clínica do usuário
   */
  private async getCategoria(id: number, clinicaId: number) {
    const categoria = await this.prisma.categoriaFinanceira.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!categoria) {
      throw new NotFoundException(
        'Categoria não encontrada ou não pertence a esta clínica.',
      );
    }
    return categoria;
  }

  /**
   * CRIAR uma nova categoria
   */
  create(dto: CreateCategoriaFinanceiraDto, usuarioLogado: Usuario) {
    return this.prisma.categoriaFinanceira.create({
      data: {
        nome: dto.nome,
        tipo: dto.tipo,
        clinicaId: usuarioLogado.clinicaId, // Segurança: Vincula à clínica do admin
      },
    });
  }

  /**
   * LISTAR todas as categorias da clínica
   */
  findAll(usuarioLogado: Usuario) {
    return this.prisma.categoriaFinanceira.findMany({
      where: {
        clinicaId: usuarioLogado.clinicaId, // Segurança: Filtra pela clínica
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * BUSCAR UMA categoria (apenas da própria clínica)
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // Segurança: Helper já faz a checagem de ID + clinicaId
    return this.getCategoria(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR uma categoria
   */
  async update(
    id: number,
    dto: UpdateCategoriaFinanceiraDto,
    usuarioLogado: Usuario,
  ) {
    // Segurança: Garante que o admin está editando uma categoria da sua clínica
    await this.getCategoria(id, usuarioLogado.clinicaId);

    return this.prisma.categoriaFinanceira.update({
      where: { id: id },
      data: dto,
    });
  }

  /**
   * REMOVER uma categoria
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // Segurança: Garante que o admin está removendo uma categoria da sua clínica
    await this.getCategoria(id, usuarioLogado.clinicaId);

    // TODO: Adicionar lógica para impedir exclusão se a categoria estiver em uso
    
    return this.prisma.categoriaFinanceira.delete({
      where: { id: id },
    });
  }
}