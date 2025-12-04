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
    async create(createDto, usuario) {
        const { parcelas, repetir, ...rest } = createDto;
        return this.prisma.transacaoFinanceira.create({
            data: {
                descricao: createDto.descricao,
                valor: createDto.valor,
                tipo: createDto.tipo,
                categoriaId: createDto.categoria_id,
                pacienteId: createDto.paciente_id,
                clinicaId: usuario.clinicaId,
                data_vencimento: createDto.data_vencimento,
            },
        });
    }
    async findAll(query, usuario) {
        const where = {
            clinicaId: usuario.clinicaId,
        };
        if (query.tipo) {
            where.tipo = query.tipo;
        }
        if (query.pacienteId) {
            where.pacienteId = query.pacienteId;
        }
        if (query.data_inicio && query.data_fim) {
            where.data_vencimento = {
                gte: new Date(query.data_inicio),
                lte: new Date(query.data_fim),
            };
        }
        if (query.status === 'PAGO') {
            where.data_pagamento = { not: null };
        }
        else if (query.status === 'ABERTO') {
            where.data_pagamento = null;
        }
        return this.prisma.transacaoFinanceira.findMany({
            where,
            orderBy: { data_vencimento: 'asc' },
            include: {
                categoria: true,
                paciente: {
                    select: { nome_completo: true },
                },
            },
        });
    }
    async findOne(id, usuario) {
        const transacao = await this.prisma.transacaoFinanceira.findFirst({
            where: {
                id: id,
                clinicaId: usuario.clinicaId,
            },
            include: {
                categoria: true,
                paciente: true,
            },
        });
        if (!transacao) {
            throw new common_1.NotFoundException('Transação não encontrada.');
        }
        return transacao;
    }
    async update(id, updateDto, usuario) {
        await this.findOne(id, usuario);
        const dadosAtualizacao = {};
        if (updateDto.descricao)
            dadosAtualizacao.descricao = updateDto.descricao;
        if (updateDto.valor)
            dadosAtualizacao.valor = updateDto.valor;
        if (updateDto.tipo)
            dadosAtualizacao.tipo = updateDto.tipo;
        if (updateDto.data_vencimento) {
            dadosAtualizacao.data_vencimento = updateDto.data_vencimento;
        }
        if (updateDto.categoria_id) {
            dadosAtualizacao.categoriaId = updateDto.categoria_id;
        }
        return this.prisma.transacaoFinanceira.update({
            where: { id },
            data: dadosAtualizacao,
        });
    }
    async remove(id, usuario) {
        await this.findOne(id, usuario);
        return this.prisma.transacaoFinanceira.delete({
            where: { id },
        });
    }
};
exports.TransacoesFinanceirasService = TransacoesFinanceirasService;
exports.TransacoesFinanceirasService = TransacoesFinanceirasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransacoesFinanceirasService);
//# sourceMappingURL=transacoes-financeiras.service.js.map