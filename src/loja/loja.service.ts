// src/loja/loja.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario, TipoTransacao } from '@prisma/client';

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  // --- 1. ADICIONAR CRÉDITO ---
  async adicionarCredito(dados: { pacienteId: number; valor: number }, usuario: Usuario) {
    const { pacienteId, valor } = dados;

    if (valor <= 0) throw new BadRequestException('O valor deve ser positivo.');

    return this.prisma.$transaction(async (tx) => {
      // 1. Atualiza o saldo do paciente
      const paciente = await tx.paciente.update({
        where: { id: pacienteId },
        data: {
          saldo: { increment: valor },
        },
      });

      // 2. Busca ou Cria a Categoria
      let categoria = await tx.categoriaFinanceira.findFirst({
        where: { 
            nome: 'Loja/Cantina',
            clinicaId: usuario.clinicaId 
        }
      });

      if (!categoria) {
        categoria = await tx.categoriaFinanceira.create({
            data: { 
                nome: 'Loja/Cantina', 
                tipo: TipoTransacao.RECEITA,
                clinicaId: usuario.clinicaId 
            }
        });
      }

      // 3. Cria o registro financeiro
      await tx.transacaoFinanceira.create({
        data: {
          descricao: `Crédito Loja - ${paciente.nome_completo}`, 
          valor: valor,
          tipo: TipoTransacao.RECEITA, 
          
          // Relações (camelCase)
          categoriaId: categoria.id,
          pacienteId: paciente.id,
          clinicaId: usuario.clinicaId,
          
          // Usuário nesta tabela é snake_case
          
          
          // Dados snake_case
          data_vencimento: new Date(),
          data_pagamento: new Date(), 
        },
      });

      return paciente;
    });
  }

  // --- 2. REALIZAR VENDA ---
  async realizarVenda(dados: { pacienteId: number; itens: { produtoId: number; qtd: number }[] }, usuario: Usuario) {
    const { pacienteId, itens } = dados;

    return this.prisma.$transaction(async (tx) => {
      const paciente = await tx.paciente.findUnique({ where: { id: pacienteId } });
      if (!paciente) throw new NotFoundException('Paciente não encontrado');

      let totalVenda = 0;

      for (const item of itens) {
        const produto = await tx.produto.findUnique({ where: { id: item.produtoId } });
        
        if (!produto) throw new NotFoundException(`Produto ID ${item.produtoId} não encontrado`);
        
        if (Number(produto.estoque) < item.qtd) {
            throw new BadRequestException(`Estoque insuficiente para ${produto.nome}.`);
        }

        totalVenda += Number(produto.valor) * item.qtd;

        // Baixa no Estoque
        await tx.produto.update({
            where: { id: item.produtoId },
            data: { estoque: { decrement: item.qtd } }
        });

        // Registro de Saída de Estoque
        await tx.saidaEstoque.create({
            data: {
                produtoId: item.produtoId,   // camelCase
                quantidade: item.qtd,
                motivo: 'VENDA_LOJA',
                usuarioId: usuario.id,       // camelCase
                
                // --- CORREÇÃO FINAL AQUI ---
                clinicaId: usuario.clinicaId // camelCase (Obrigatório)
            }
        });
      }

      if (Number(paciente.saldo) < totalVenda) {
        throw new BadRequestException(`Saldo insuficiente. Total: R$ ${totalVenda}, Saldo: R$ ${paciente.saldo}`);
      }

      // Deduz do saldo
      await tx.paciente.update({
        where: { id: pacienteId },
        data: { saldo: { decrement: totalVenda } },
      });

      return { 
          message: 'Venda realizada com sucesso', 
          novoSaldo: Number(paciente.saldo) - totalVenda 
      };
    });
  }
}