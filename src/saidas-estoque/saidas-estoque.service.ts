// src/saidas-estoque/saidas-estoque.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSaidaEstoqueDto } from './dto/create-saidas-estoque.dto';
import { QuerySaidaEstoqueDto } from './dto/query-saida-estoque.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class SaidasEstoqueService {
  constructor(private prisma: PrismaService) {}

  /**
   * CRIAR uma nova Saída e ATUALIZAR o estoque do Produto (Transacional)
   */
  async create(dto: CreateSaidaEstoqueDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Valida se o produto existe e é da clínica
    const produto = await this.prisma.produto.findFirst({
      where: { id: dto.produtoId, clinicaId: clinicaId },
    });
    if (!produto) {
      throw new NotFoundException('Produto não encontrado nesta clínica.');
    }

    // 2. REGRA DE NEGÓCIO: Verifica se há estoque suficiente
    // --- CORREÇÃO: Usando 'estoque' ---
    if (produto.estoque < dto.quantidade) {
      throw new ConflictException(
        `Estoque insuficiente. Estoque atual: ${produto.estoque}`,
      );
    }

    // 3. Executa as duas operações dentro de uma transação
    try {
      const [saida, produtoAtualizado] = await this.prisma.$transaction([
        // 3a. Cria o registro de Saída
        this.prisma.saidaEstoque.create({
          data: {
            quantidade: dto.quantidade,
            motivo: dto.motivo,
            clinicaId: clinicaId,
            produtoId: dto.produtoId,
            usuarioId: usuarioLogado.id, // Auditoria
          },
        }),
        
        // 3b. Atualiza (DECREMENTA) o estoque do produto
        this.prisma.produto.update({
          where: { id: dto.produtoId },
          data: {
            // --- CORREÇÃO: Usando 'estoque' ---
            estoque: {
              decrement: dto.quantidade, // Subtrai a quantidade do total
            },
          },
        }),
      ]);

      // --- CORREÇÃO: Retornando 'estoque' ---
      return { saida, estoque_atual: produtoAtualizado.estoque };
    } catch (error) {
      throw new Error(`Falha na transação de estoque: ${error.message}`);
    }
  }

  /**
   * LISTAR todas as saídas (com filtros)
   */
  async findAll(query: QuerySaidaEstoqueDto, usuarioLogado: Usuario) {
    const where: Prisma.SaidaEstoqueWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
    };

    if (query.produtoId) {
      where.produtoId = query.produtoId;
    }

    return this.prisma.saidaEstoque.findMany({
      where: where,
      include: {
        produto: { select: { nome: true } },
        usuario_registrou: { select: { nome_completo: true } },
      },
      orderBy: {
        data_saida: 'desc',
      },
    });
  }

  // --- MÉTODOS NÃO SUPORTADOS (REGRA DE NEGÓCIO) ---

  findOne(id: number) {
    throw new NotFoundException('Use GET /saidas-estoque?produtoId=...');
  }

  update(id: number) {
    throw new NotFoundException('Não é permitido atualizar uma saída de estoque.');
  }

  remove(id: number) {
    throw new NotFoundException('Não é permitido remover uma saída de estoque.');
  }
}