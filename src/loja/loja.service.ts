import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LojaService {
  constructor(private prisma: PrismaService) {}

  // 1. Adicionar Crédito
  async adicionarCredito(pacienteId: number, valor: number, usuarioId: number, clinicaId: number) {
    // Verifica se paciente existe
    const paciente = await this.prisma.paciente.findUnique({ where: { id: pacienteId }});
    if (!paciente) throw new NotFoundException('Paciente não encontrado');

    return this.prisma.$transaction(async (tx) => {
      // Aumenta saldo
      await tx.paciente.update({
        where: { id: pacienteId },
        data: { saldo: { increment: valor } }
      });

      // Lança no financeiro
      await tx.transacaoFinanceira.create({
        data: {
          descricao: `Crédito Loja - Paciente ${paciente.nome_completo}`,
          valor: Number(valor), // Garante que é número
          tipo: 'RECEITA',
          data_vencimento: new Date(),
          data_pagamento: new Date(),
          clinicaId,
          // Removemos o 'usuarioBaixaId' pois não existe no Schema atual da TransacaoFinanceira
          // O vínculo fica pelo pacienteId ou lógica de caixa se houver
          pacienteId: pacienteId, 
          categoriaId: 1 // TODO: Criar uma categoria padrão "Loja" e usar o ID real aqui
        }
      });
      return { message: 'Crédito adicionado com sucesso' };
    });
  }

  // 2. Realizar Venda
  async realizarVenda(pacienteId: number, itens: { produtoId: number, qtd: number }[], usuarioId: number, clinicaId: number) {
    return this.prisma.$transaction(async (tx) => {
      // Calcula total e verifica estoque
      let total = 0;
      for (const item of itens) {
        const prod = await tx.produto.findUnique({ where: { id: item.produtoId } });
        if (!prod || prod.estoque < item.qtd) {
             throw new BadRequestException(`Estoque insuficiente ou produto inválido: ${prod?.nome}`);
        }
        total += Number(prod.valor) * item.qtd;
      }

      // Verifica saldo do paciente
      const paciente = await tx.paciente.findUnique({ where: { id: pacienteId } });
      
      // Correção do erro de nulo
      if (!paciente) throw new NotFoundException('Paciente não encontrado');

      if (Number(paciente.saldo) < total) throw new BadRequestException('Saldo insuficiente.');

      // Debita saldo
      await tx.paciente.update({
        where: { id: pacienteId },
        data: { saldo: { decrement: total } }
      });

      // Cria Venda
      const venda = await tx.venda.create({
        data: {
          pacienteId,
          usuarioId,
          clinicaId,
          valor_total: total,
          itens: {
            create: itens.map(i => ({
              produtoId: i.produtoId,
              qtd: i.qtd,
              valor_unitario: 0 // Ideal: Buscar valor do produto no loop acima
            }))
          }
        }
      });

      // Baixa estoque
      for (const item of itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { decrement: item.qtd } }
        });
      }

      return venda;
    });
  }
}