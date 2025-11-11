"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatoriosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let RelatoriosService = class RelatoriosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard(usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        const agora = new Date();
        const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
        const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);
        const [pacientesAtivos, leitosOcupados, leitosDisponiveis, admissoesNoMes,] = await Promise.all([
            this.prisma.paciente.count({
                where: { clinicaId: clinicaId, status: client_1.StatusPaciente.ATIVO },
            }),
            this.prisma.leito.count({
                where: { clinicaId: clinicaId, status: client_1.StatusLeito.OCUPADO },
            }),
            this.prisma.leito.count({
                where: { clinicaId: clinicaId, status: client_1.StatusLeito.DISPONIVEL },
            }),
            this.prisma.paciente.count({
                where: {
                    clinicaId: clinicaId,
                    data_admissao: { gte: inicioMes, lte: fimMes },
                },
            }),
        ]);
        const totalReceitas = await this.prisma.transacaoFinanceira.aggregate({
            _sum: { valor: true },
            where: {
                clinicaId: clinicaId,
                tipo: client_1.TipoTransacao.RECEITA,
                data_pagamento: { gte: inicioMes, lte: fimMes },
            },
        });
        const totalDespesas = await this.prisma.transacaoFinanceira.aggregate({
            _sum: { valor: true },
            where: {
                clinicaId: clinicaId,
                tipo: client_1.TipoTransacao.DESPESA,
                data_pagamento: { gte: inicioMes, lte: fimMes },
            },
        });
        const totalLeitos = leitosOcupados + leitosDisponiveis;
        const taxaOcupacao = totalLeitos > 0
            ? (leitosOcupados / totalLeitos) * 100
            : 0;
        const saldoMes = (totalReceitas._sum.valor || 0) - (totalDespesas._sum.valor || 0);
        return {
            pacientes: {
                ativos: pacientesAtivos,
                admissoesNoMes: admissoesNoMes,
            },
            leitos: {
                ocupados: leitosOcupados,
                disponiveis: leitosDisponiveis,
                total: totalLeitos,
                taxaOcupacao: parseFloat(taxaOcupacao.toFixed(2)),
            },
            financeiro: {
                receitaMes: totalReceitas._sum.valor || 0,
                despesaMes: totalDespesas._sum.valor || 0,
                saldoMes: saldoMes,
            },
            dataAtualizacao: agora.toISOString(),
        };
    }
};
exports.RelatoriosService = RelatoriosService;
exports.RelatoriosService = RelatoriosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RelatoriosService);
//# sourceMappingURL=relatorios.service.js.map