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
        estoque: 0, // Estoque inicial é sempre 0
        
        // --- CORREÇÃO: GARANTE O TIPO ---
        // Se o DTO vier com "LOJA", salva LOJA. Se vier vazio, salva FARMACIA.
        tipo: dto.tipo || 'FARMACIA', 
      },
    });
  }

  /**
   * LISTAR produtos (Com Filtro opcional de Tipo)
   */
  // --- CORREÇÃO: Adicionado o argumento 'tipo' opcional ---
  async findAll(usuarioLogado: Usuario, tipo?: string) {
    
    // Cria o objeto de filtro base (apenas clínica)
    const where: any = {
      clinicaId: usuarioLogado.clinicaId,
    };

    // --- CORREÇÃO: Se o tipo foi informado, adiciona ao filtro ---
    if (tipo) {
      where.tipo = tipo;
    }

    return this.prisma.produto.findMany({
      where: where, // Usa o filtro dinâmico
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * BUSCAR UM produto
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    return this.getProduto(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR um produto
   */
  async update(id: number, dto: UpdateProdutoDto, usuarioLogado: Usuario) {
    await this.getProduto(id, usuarioLogado.clinicaId);

    return this.prisma.produto.update({
      where: { id: id },
      data: dto, 
    });
  }

  /**
   * REMOVER um produto
   */
  async remove(id: number, usuarioLogado: Usuario) {
    await this.getProduto(id, usuarioLogado.clinicaId);

    const entradas = await this.prisma.entradaEstoque.count({
      where: { produtoId: id },
    });
    const saidas = await this.prisma.saidaEstoque.count({
      where: { produtoId: id },
    });

    if (entradas > 0 || saidas > 0) {
      throw new ConflictException(
        'Este produto possui histórico e não pode ser removido. Considere desativá-lo.',
      );
    }
    
    return this.prisma.produto.delete({
      where: { id: id },
    });
  }
}