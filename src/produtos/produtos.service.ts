// src/produtos/produtos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida se o produto existe e pertence à clínica
   */
  private async getProduto(id: number, clinicaId: number) {
    const produto = await this.prisma.produto.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado nesta clínica.');
    }
    return produto;
  }

  /**
   * CRIAR um novo produto no catálogo
   */
  async create(dto: CreateProdutoDto, usuarioLogado: Usuario) {
    return this.prisma.produto.create({
      data: {
        ...dto,
        clinicaId: usuarioLogado.clinicaId, // Segurança
        quantidade_estoque: 0, // Estoque inicial é sempre 0
      },
    });
  }

  /**
   * LISTAR todos os produtos da clínica
   */
  async findAll(usuarioLogado: Usuario) {
    return this.prisma.produto.findMany({
      where: {
        clinicaId: usuarioLogado.clinicaId, // Segurança
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * BUSCAR UM produto
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // Helper já faz a validação de segurança
    return this.getProduto(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR um produto (nome, descrição, etc.)
   */
  async update(id: number, dto: UpdateProdutoDto, usuarioLogado: Usuario) {
    // 1. Valida se o produto é da clínica
    await this.getProduto(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: Já está implementada no DTO.
    // O UpdateProdutoDto não contém 'quantidade_estoque',
    // então é impossível atualizá-lo por esta rota.
    // As linhas de 'destructuring' com erro foram removidas.

    // 3. Atualiza
    return this.prisma.produto.update({
      where: { id: id },
      data: dto, // Passa o DTO diretamente, pois ele já é seguro
    });
  }

  /**
   * REMOVER um produto
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // 1. Valida se o produto é da clínica
    await this.getProduto(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: Não permite excluir se houver histórico
    const entradas = await this.prisma.entradaEstoque.count({
      where: { produtoId: id },
    });
    const saidas = await this.prisma.saidaEstoque.count({
      where: { produtoId: id },
    });

    if (entradas > 0 || saidas > 0) {
      throw new ConflictException(
        'Este produto possui um histórico de estoque (entradas/saídas) e não pode ser removido. Considere desativá-lo.',
      );
    }
    
    // 3. Remove
    return this.prisma.produto.delete({
      where: { id: id },
    });
  }
}