// src/loja/loja.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class LojaService {
  constructor(private readonly prisma: PrismaService) {}

  // --- 1. ADICIONAR CRÉDITO ---
  async adicionarCredito(dados: { pacienteId: number; valor: number }, usuario: Usuario) {
    const { pacienteId, valor } = dados;

    if (valor <= 0) throw new BadRequestException('O valor deve ser positivo.');

    // Usamos transaction para garantir que o saldo entre E o registro financeiro seja criado
    return this.prisma.$transaction(async (tx) => {
      // 1. Atualiza o saldo do paciente
      const paciente = await tx.paciente.update({
        where: { id: pacienteId },
        data: {
          saldo: { increment: valor },
        },
      });

      // 2. Cria o registro financeiro (O dinheiro entrou no caixa)
      await tx.transacaoFinanceira.create({
        data: {
          descricao: `Crédito Loja - ${paciente.nomeCompleto}`,
          valor: valor,
          tipo: 'RECEITA',
          categoria: {
            connectOrCreate: {
                where: { nome: 'Loja/Cantina' }, // Garante que a categoria exista
                create: { nome: 'Loja/Cantina', tipo: 'RECEITA' }
            }
          },
          pacienteId: paciente.id,
          clinicaId: usuario.clinicaId,
          usuarioLancamentoId: usuario.id,
          dataVencimento: new Date(),
          dataPagamento: new Date(), // Já entra como pago
          formaPagamento: 'DINHEIRO', // Ou ajuste conforme necessidade
        },
      });

      return paciente;
    });
  }

  // --- 2. REALIZAR VENDA ---
  async realizarVenda(dados: { pacienteId: number; itens: { produtoId: number; qtd: number }[] }, usuario: Usuario) {
    const { pacienteId, itens } = dados;

    // Transaction para garantir consistência (Estoque + Saldo)
    return this.prisma.$transaction(async (tx) => {
      // 1. Busca o paciente e verifica saldo
      const paciente = await tx.paciente.findUnique({ where: { id: pacienteId } });
      if (!paciente) throw new NotFoundException('Paciente não encontrado');

      // 2. Calcula total e verifica estoque
      let totalVenda = 0;

      for (const item of itens) {
        const produto = await tx.produto.findUnique({ where: { id: item.produtoId } });
        
        if (!produto) throw new NotFoundException(`Produto ID ${item.produtoId} não encontrado`);
        if (produto.estoque < item.qtd) {
            throw new BadRequestException(`Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}`);
        }

        totalVenda += Number(produto.valor) * item.qtd;

        // 3. Baixa no Estoque
        await tx.produto.update({
            where: { id: item.produtoId },
            data: { estoque: { decrement: item.qtd } }
        });

        // 4. Registra Saída de Estoque (Histórico)
        await tx.saidaEstoque.create({
            data: {
                produtoId: item.produtoId,
                quantidade: item.qtd,
                motivo: 'VENDA_LOJA',
                usuarioId: usuario.id,
                pacienteId: pacienteId
            }
        });
      }

      // 5. Verifica se o paciente tem saldo suficiente
      if (paciente.saldo < totalVenda) {
        throw new BadRequestException(`Saldo insuficiente. Total: R$ ${totalVenda}, Saldo: R$ ${paciente.saldo}`);
      }

      // 6. Deduz do saldo do paciente
      await tx.paciente.update({
        where: { id: pacienteId },
        data: { saldo: { decrement: totalVenda } },
      });

      return { message: 'Venda realizada com sucesso', novoSaldo: paciente.saldo - totalVenda };
    });
  }
}