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
const client_1 = require("@prisma/client");
let LojaService = class LojaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async adicionarCredito(dados, usuario) {
        const { pacienteId, valor } = dados;
        if (valor <= 0)
            throw new common_1.BadRequestException('O valor deve ser positivo.');
        return this.prisma.$transaction(async (tx) => {
            const paciente = await tx.paciente.update({
                where: { id: pacienteId },
                data: {
                    saldo: { increment: valor },
                },
            });
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
                        tipo: client_1.TipoTransacao.RECEITA,
                        clinicaId: usuario.clinicaId
                    }
                });
            }
            await tx.transacaoFinanceira.create({
                data: {
                    descricao: `Crédito Loja - ${paciente.nome_completo}`,
                    valor: valor,
                    tipo: client_1.TipoTransacao.RECEITA,
                    categoriaId: categoria.id,
                    pacienteId: paciente.id,
                    clinicaId: usuario.clinicaId,
                    data_vencimento: new Date(),
                    data_pagamento: new Date(),
                },
            });
            return paciente;
        });
    }
    async realizarVenda(dados, usuario) {
        const { pacienteId, itens } = dados;
        return this.prisma.$transaction(async (tx) => {
            const paciente = await tx.paciente.findUnique({ where: { id: pacienteId } });
            if (!paciente)
                throw new common_1.NotFoundException('Paciente não encontrado');
            let totalVenda = 0;
            for (const item of itens) {
                const produto = await tx.produto.findUnique({ where: { id: item.produtoId } });
                if (!produto)
                    throw new common_1.NotFoundException(`Produto ID ${item.produtoId} não encontrado`);
                if (Number(produto.estoque) < item.qtd) {
                    throw new common_1.BadRequestException(`Estoque insuficiente para ${produto.nome}.`);
                }
                totalVenda += Number(produto.valor) * item.qtd;
                await tx.produto.update({
                    where: { id: item.produtoId },
                    data: { estoque: { decrement: item.qtd } }
                });
                await tx.saidaEstoque.create({
                    data: {
                        produtoId: item.produtoId,
                        quantidade: item.qtd,
                        motivo: 'VENDA_LOJA',
                        usuarioId: usuario.id,
                        clinicaId: usuario.clinicaId
                    }
                });
            }
            if (Number(paciente.saldo) < totalVenda) {
                throw new common_1.BadRequestException(`Saldo insuficiente. Total: R$ ${totalVenda}, Saldo: R$ ${paciente.saldo}`);
            }
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
};
exports.LojaService = LojaService;
exports.LojaService = LojaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LojaService);
//# sourceMappingURL=loja.service.js.map