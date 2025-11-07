// src/relatorios/relatorios.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StatusLeito, StatusPaciente, TipoTransacao, Usuario } from '@prisma/client';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Busca os principais KPIs (Indicadores) para o Dashboard da clínica
   */
  async getDashboard(usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // --- Definição de Períodos ---
    const agora = new Date();
    // Início do mês atual (ex: 01/11/2025 00:00:00)
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    // Fim do mês atual (ex: 30/11/2025 23:59:59)
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

    // --- 1. Queries de Contagem (Pacientes e Leitos) ---
    // (Usamos Promise.all para rodar todas as buscas em paralelo)
    const [
      pacientesAtivos,
      leitosOcupados,
      leitosDisponiveis,
      admissoesNoMes,
    ] = await Promise.all([
      // Total de Pacientes com status ATIVO
      this.prisma.paciente.count({
        where: { clinicaId: clinicaId, status: StatusPaciente.ATIVO },
      }),
      // Total de Leitos OCUPADOS
      this.prisma.leito.count({
        where: { clinicaId: clinicaId, status: StatusLeito.OCUPADO },
      }),
      // Total de Leitos DISPONÍVEIS
      this.prisma.leito.count({
        where: { clinicaId: clinicaId, status: StatusLeito.DISPONIVEL },
      }),
      // Novas internações (check-ins) no mês
      this.prisma.paciente.count({
        where: {
          clinicaId: clinicaId,
          // (status: StatusPaciente.ATIVO,) // Opcional
          data_admissao: { gte: inicioMes, lte: fimMes }, // Filtra pela data de admissão
        },
      }),
    ]);

    // --- 2. Queries de Agregação (Financeiro) ---
    // (Usamos o 'aggregate' do Prisma para Somar (sum))

    // Total de Receitas PAGAS no mês
    const totalReceitas = await this.prisma.transacaoFinanceira.aggregate({
      _sum: { valor: true },
      where: {
        clinicaId: clinicaId,
        tipo: TipoTransacao.RECEITA,
        data_pagamento: { gte: inicioMes, lte: fimMes }, // Pago este mês
      },
    });

    // Total de Despesas PAGAS no mês
    const totalDespesas = await this.prisma.transacaoFinanceira.aggregate({
      _sum: { valor: true },
      where: {
        clinicaId: clinicaId,
        tipo: TipoTransacao.DESPESA,
        data_pagamento: { gte: inicioMes, lte: fimMes }, // Pago este mês
      },
    });

    // --- 3. Cálculos ---
    const totalLeitos = leitosOcupados + leitosDisponiveis;
    const taxaOcupacao = totalLeitos > 0
      ? (leitosOcupados / totalLeitos) * 100
      : 0;

    const saldoMes = (totalReceitas._sum.valor || 0) - (totalDespesas._sum.valor || 0);

    // --- 4. Monta a Resposta ---
    return {
      pacientes: {
        ativos: pacientesAtivos,
        admissoesNoMes: admissoesNoMes,
      },
      leitos: {
        ocupados: leitosOcupados,
        disponiveis: leitosDisponiveis,
        total: totalLeitos,
        taxaOcupacao: parseFloat(taxaOcupacao.toFixed(2)), // ex: 80.50
      },
      financeiro: {
        receitaMes: totalReceitas._sum.valor || 0,
        despesaMes: totalDespesas._sum.valor || 0,
        saldoMes: saldoMes,
      },
      dataAtualizacao: agora.toISOString(),
    };
  }
}