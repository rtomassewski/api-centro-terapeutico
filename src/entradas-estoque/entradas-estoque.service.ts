// src/entradas-estoque/entradas-estoque.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntradaEstoqueDto } from './dto/create-entradas-estoque.dto';
import { QueryEntradaEstoqueDto } from './dto/query-entrada-estoque.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class EntradasEstoqueService {
  constructor(private prisma: PrismaService) {}

  /**
   * CRIAR uma nova Entrada e ATUALIZAR o estoque do Produto (Transacional)
   */
  async create(dto: CreateEntradaEstoqueDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Valida se o produto existe e é da clínica
    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, clinicaId: clinicaId },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado nesta clínica.');
    }

    // 2. Executa as duas operações dentro de uma transação
    try {
      const [entrada, produtoAtualizado] = await this.prisma.$transaction([
        // 2a. Cria o registro de Entrada
        this.prisma.entradaEstoque.create({
          data: {
            quantidade: dto.quantidade,
            lote: dto.lote,
            data_validade: dto.data_validade
              ? new Date(dto.data_validade)
              : null,
            clinicaId: clinicaId,
            produtoId: dto.produtoId,
            usuarioId: usuarioLogado.id, // Auditoria
          },
        }),
        
        // 2b. Atualiza (INCREMENTA) o estoque do produto
        this.prisma.produto.update({
          where: { id: dto.produtoId },
          data: {
            // --- CORREÇÃO: Usando 'estoque' ---
            estoque: {
              increment: dto.quantidade, // Adiciona a quantidade ao total
            },
          },
        }),
      ]);

      // --- CORREÇÃO: Retornando 'estoque' ---
      return { entrada, estoque_atual: produtoAtualizado.estoque };
    } catch (error) {
      throw new Error(`Falha na transação de estoque: ${error.message}`);
    }
  }

  /**
   * LISTAR todas as entradas (com filtros)
   */
  async findAll(query: QueryEntradaEstoqueDto, usuarioLogado: Usuario) {
    const where: Prisma.EntradaEstoqueWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
    };

    if (query.produtoId) {
      where.produtoId = query.produtoId;
    }

    return this.prisma.entradaEstoque.findMany({
      where: where,
      include: {
        produto: { select: { nome: true } },
        usuario_registrou: { select: { nome_completo: true } },
      },
      orderBy: {
        data_entrada: 'desc',
      },
    });
  }

  // --- MÉTODOS NÃO SUPORTADOS (REGRA DE NEGÓCIO) ---

  findOne(id: number) {
    // Implementar se necessário, mas geralmente listamos pelo produto
    throw new NotFoundException('Use GET /entradas-estoque?produtoId=...');
  }

  update(id: number) {
    // Não suportado por regra de negócio (auditoria)
    throw new NotFoundException('Não é permitido atualizar uma entrada de estoque.');
  }

  remove(id: number) {
    // Não suportado por regra de negócio (auditoria)
    throw new NotFoundException('Não é permitido remover uma entrada de estoque.');
  }
}