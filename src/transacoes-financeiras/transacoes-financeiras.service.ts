// src/transacoes-financeiras/transacoes-financeiras.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';
import { PrismaService } from '../prisma.service';
import { Usuario, Prisma } from '@prisma/client';
import { QueryTransacaoFinanceiraDto } from './dto/query-transacao-financeira.dto';

@Injectable()
export class TransacoesFinanceirasService {
  
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Verifica se a transação pertence à clínica
   */
  private async getTransacao(id: number, clinicaId: number) {
    const transacao = await this.prisma.transacaoFinanceira.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!transacao) {
      throw new NotFoundException(
        'Transação não encontrada ou não pertence a esta clínica.',
      );
    }
    return transacao;
  }

  /**
   * CRIAR um novo lançamento (Receita ou Despesa)
   */
  async create(dto: CreateTransacaoFinanceiraDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // TODO: Validar se a categoriaId e o pacienteId
    // também pertencem à clinicaId do usuário.

    return this.prisma.transacaoFinanceira.create({
      data: {
        // --- CORREÇÃO AQUI ---
        descricao: dto.descricao,
        valor: dto.valor,
        tipo: dto.tipo,
        data_vencimento: new Date(dto.data_vencimento), // Converte a String
        categoriaId: dto.categoriaId,
        pacienteId: dto.pacienteId,
        clinicaId: usuarioLogado.clinicaId, // Segurança: Vincula à clínica
      },
    });
  }

  /**
   * LISTAR todas as transações (Fluxo de Caixa)
   */
  async findAll(
    query: QueryTransacaoFinanceiraDto, // 1. Aceita a Query
    usuarioLogado: Usuario,
  ) {
    // 2. Filtro base de segurança
    const where: Prisma.TransacaoFinanceiraWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
    };

    // 3. Adiciona filtros dinâmicos
    if (query.pacienteId) {
      where.pacienteId = query.pacienteId;
    }
    if (query.tipo) {
      where.tipo = query.tipo;
    }
    if (query.data_inicio && query.data_fim) {
      where.data_vencimento = {
        gte: new Date(query.data_inicio),
        lte: new Date(query.data_fim),
      };
    }

    // 4. Busca no banco
    return this.prisma.transacaoFinanceira.findMany({
      where: where, // Usa os filtros
      include: {
        categoria: { select: { nome: true } },
        paciente: { select: { nome_completo: true } },
      },
      orderBy: {
        data_vencimento: 'desc',
      },
    });
  }

  /**
   * BUSCAR UMA transação
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // Segurança: Helper já faz a checagem
    return this.getTransacao(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR uma transação (ou Marcar como Paga)
   */
  async update(
    id: number,
    dto: UpdateTransacaoFinanceiraDto,
    usuarioLogado: Usuario,
  ) {
    // Segurança: Garante que o admin está editando
    await this.getTransacao(id, usuarioLogado.clinicaId);

    // Converte a data de pagamento (se enviada)
    const dataPagamento = dto.data_pagamento
      ? new Date(dto.data_pagamento)
      : dto.data_pagamento === null // Permite "despagar"
      ? null
      : undefined;

    return this.prisma.transacaoFinanceira.update({
      where: { id: id },
      data: {
        ...dto,
        data_pagamento: dataPagamento,
      },
    });
  }

  /**
   * REMOVER uma transação
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // Segurança: Garante que o admin está removendo
    await this.getTransacao(id, usuarioLogado.clinicaId);

    return this.prisma.transacaoFinanceira.delete({
      where: { id: id },
    });
  }
}