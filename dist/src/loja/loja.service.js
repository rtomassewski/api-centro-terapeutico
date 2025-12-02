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
exports.LojaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let LojaService = class LojaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async adicionarCredito(pacienteId, valor, usuarioId, clinicaId) {
        const paciente = await this.prisma.paciente.findUnique({ where: { id: pacienteId } });
        if (!paciente)
            throw new common_1.NotFoundException('Paciente não encontrado');
        return this.prisma.$transaction(async (tx) => {
            await tx.paciente.update({
                where: { id: pacienteId },
                data: { saldo: { increment: valor } }
            });
            await tx.transacaoFinanceira.create({
                data: {
                    descricao: `Crédito Loja - Paciente ${paciente.nome_completo}`,
                    valor: Number(valor),
                    tipo: 'RECEITA',
                    data_vencimento: new Date(),
                    data_pagamento: new Date(),
                    clinicaId,
                    pacienteId: pacienteId,
                    categoriaId: 1
                }
            });
            return { message: 'Crédito adicionado com sucesso' };
        });
    }
    async realizarVenda(pacienteId, itens, usuarioId, clinicaId) {
        return this.prisma.$transaction(async (tx) => {
            let total = 0;
            for (const item of itens) {
                const prod = await tx.produto.findUnique({ where: { id: item.produtoId } });
                if (!prod || prod.estoque < item.qtd) {
                    throw new common_1.BadRequestException(`Estoque insuficiente ou produto inválido: ${prod?.nome}`);
                }
                total += Number(prod.valor) * item.qtd;
            }
            const paciente = await tx.paciente.findUnique({ where: { id: pacienteId } });
            if (!paciente)
                throw new common_1.NotFoundException('Paciente não encontrado');
            if (Number(paciente.saldo) < total)
                throw new common_1.BadRequestException('Saldo insuficiente.');
            await tx.paciente.update({
                where: { id: pacienteId },
                data: { saldo: { decrement: total } }
            });
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
                            valor_unitario: 0
                        }))
                    }
                }
            });
            for (const item of itens) {
                await tx.produto.update({
                    where: { id: item.produtoId },
                    data: { estoque: { decrement: item.qtd } }
                });
            }
            return venda;
        });
    }
};
exports.LojaService = LojaService;
exports.LojaService = LojaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LojaService);
//# sourceMappingURL=loja.service.js.map