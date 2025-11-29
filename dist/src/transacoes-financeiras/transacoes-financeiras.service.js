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
exports.TransacoesFinanceirasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TransacoesFinanceirasService = class TransacoesFinanceirasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTransacao(id, clinicaId) {
        const transacao = await this.prisma.transacaoFinanceira.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!transacao) {
            throw new common_1.NotFoundException('Transação não encontrada ou não pertence a esta clínica.');
        }
        return transacao;
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        return this.prisma.transacaoFinanceira.create({
            data: {
                descricao: dto.descricao,
                valor: dto.valor,
                tipo: dto.tipo,
                data_vencimento: new Date(dto.data_vencimento),
                categoriaId: dto.categoriaId,
                pacienteId: dto.pacienteId,
                clinicaId: usuarioLogado.clinicaId,
            },
        });
    }
    async findAll(query, usuarioLogado) {
        const where = {
            clinicaId: usuarioLogado.clinicaId,
        };
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
        return this.prisma.transacaoFinanceira.findMany({
            where: where,
            include: {
                categoria: { select: { nome: true } },
                paciente: { select: { nome_completo: true } },
            },
            orderBy: {
                data_vencimento: 'desc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        return this.getTransacao(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getTransacao(id, usuarioLogado.clinicaId);
        const dataPagamento = dto.data_pagamento
            ? new Date(dto.data_pagamento)
            : dto.data_pagamento === null
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
    async remove(id, usuarioLogado) {
        await this.getTransacao(id, usuarioLogado.clinicaId);
        return this.prisma.transacaoFinanceira.delete({
            where: { id: id },
        });
    }
};
exports.TransacoesFinanceirasService = TransacoesFinanceirasService;
exports.TransacoesFinanceirasService = TransacoesFinanceirasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransacoesFinanceirasService);
//# sourceMappingURL=transacoes-financeiras.service.js.map