// src/transacoes-financeiras/transacoes-financeiras.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';
import { QueryTransacaoFinanceiraDto } from './dto/query-transacao-financeira.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class TransacoesFinanceirasService {
  constructor(private readonly prisma: PrismaService) {}

  // --- CRIAR ---
  async create(createDto: CreateTransacaoFinanceiraDto, usuario: Usuario) {
    // Removemos campos lógicos
    const { parcelas, repetir, ...rest } = createDto;

    return this.prisma.transacaoFinanceira.create({
      data: {
        descricao: createDto.descricao,
        valor: createDto.valor,
        tipo: createDto.tipo,
        
        // --- RELAÇÕES (camelCase) ---
        // O Prisma gerou essas relações em camelCase
        categoriaId: createDto.categoria_id,       
        pacienteId: createDto.paciente_id,         
        clinicaId: usuario.clinicaId,              
        
        // --- DADOS BRUTOS (snake_case) ---
        // O Prisma manteve os nomes originais das colunas aqui
        
        data_vencimento: createDto.data_vencimento, 
      },
    });
  }

  // --- LISTAR TUDO ---
  async findAll(query: QueryTransacaoFinanceiraDto, usuario: Usuario) {
    const where: any = {
      clinicaId: usuario.clinicaId, // camelCase
    };

    if (query.tipo) {
      where.tipo = query.tipo;
    }

    if (query.pacienteId) {
      where.pacienteId = query.pacienteId; // camelCase
    }

    if (query.data_inicio && query.data_fim) {
      where.data_vencimento = { // snake_case
        gte: new Date(query.data_inicio),
        lte: new Date(query.data_fim),
      };
    }

    if (query.status === 'PAGO') {
      where.data_pagamento = { not: null }; // snake_case
    } else if (query.status === 'ABERTO') {
      where.data_pagamento = null;
    }

    return this.prisma.transacaoFinanceira.findMany({
      where,
      orderBy: { data_vencimento: 'asc' }, // snake_case
      include: {
        categoria: true,
        paciente: {
          select: { nome_completo: true }, // snake_case
        },
      },
    });
  }

  // --- BUSCAR UM ---
  async findOne(id: number, usuario: Usuario) {
    const transacao = await this.prisma.transacaoFinanceira.findFirst({
      where: {
        id: id,
        clinicaId: usuario.clinicaId, // camelCase
      },
      include: {
        categoria: true,
        paciente: true,
      },
    });

    if (!transacao) {
      throw new NotFoundException('Transação não encontrada.');
    }

    return transacao;
  }

  // --- ATUALIZAR ---
  async update(id: number, updateDto: UpdateTransacaoFinanceiraDto, usuario: Usuario) {
    await this.findOne(id, usuario);

    const dadosAtualizacao: any = {};

    if (updateDto.descricao) dadosAtualizacao.descricao = updateDto.descricao;
    if (updateDto.valor) dadosAtualizacao.valor = updateDto.valor;
    if (updateDto.tipo) dadosAtualizacao.tipo = updateDto.tipo;
    
    // snake_case
    if (updateDto.data_vencimento) { 
      dadosAtualizacao.data_vencimento = updateDto.data_vencimento;
    }
    
    // camelCase (Relação)
    if (updateDto.categoria_id) {
      dadosAtualizacao.categoriaId = updateDto.categoria_id;
    }

    return this.prisma.transacaoFinanceira.update({
      where: { id },
      data: dadosAtualizacao,
    });
  }

  // --- REMOVER ---
  async remove(id: number, usuario: Usuario) {
    await this.findOne(id, usuario);

    return this.prisma.transacaoFinanceira.delete({
      where: { id },
    });
  }
}