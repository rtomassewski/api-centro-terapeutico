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
        
        // --- CORREÇÃO AQUI: Mudado de 'quantidade_estoque' para 'estoque' ---
        estoque: 0, // Estoque inicial é sempre 0
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
   * ATUALIZAR um produto (nome, descrição, valor, etc.)
   */
  async update(id: number, dto: UpdateProdutoDto, usuarioLogado: Usuario) {
    // 1. Valida se o produto é da clínica
    await this.getProduto(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: O DTO não deve ter controle de estoque direto
    
    // 3. Atualiza
    return this.prisma.produto.update({
      where: { id: id },
      data: dto, 
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

    // Se tiver itens na loja vendidos, também não deveria excluir (opcional adicionar verificação aqui)
    
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