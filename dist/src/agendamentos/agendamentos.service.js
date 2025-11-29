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
exports.AgendamentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let AgendamentosService = class AgendamentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarPrestador(usuarioId, clinicaId) {
        const prestador = await this.prisma.usuario.findFirst({
            where: {
                id: usuarioId,
                clinicaId: clinicaId,
                ativo: true,
            },
            include: { papel: true },
        });
        if (!prestador) {
            throw new common_1.BadRequestException('Prestador não encontrado ou inativo.');
        }
        const papeisPermitidos = ['MEDICO', 'DENTISTA', 'PSICOLOGO', 'TERAPEUTA', 'ENFERMEIRO'];
        if (!papeisPermitidos.includes(prestador.papel.nome)) {
            throw new common_1.BadRequestException(`O usuário selecionado (${prestador.papel.nome}) não pode realizar atendimentos.`);
        }
    }
    async getAgendamento(id, clinicaId) {
        const agendamento = await this.prisma.agendamento.findFirst({
            where: { id, clinicaId },
            include: {
                procedimentos: { include: { procedimento: true } }
            }
        });
        if (!agendamento) {
            throw new common_1.NotFoundException(`Agendamento #${id} não encontrado.`);
        }
        return agendamento;
    }
    async create(dto, usuarioLogado) {
        await this.validarPrestador(dto.usuarioId, usuarioLogado.clinicaId);
        const dataInicio = new Date(dto.data_hora_inicio);
        const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000);
        let valorTotal = 0;
        let createProcedimentosRelation = {};
        if (dto.procedimentoIds && dto.procedimentoIds.length > 0) {
            const procedimentos = await this.prisma.procedimento.findMany({
                where: {
                    id: { in: dto.procedimentoIds },
                    clinicaId: usuarioLogado.clinicaId,
                    ativo: true,
                },
            });
            valorTotal = procedimentos.reduce((acc, curr) => acc + curr.valor, 0);
            createProcedimentosRelation = {
                create: procedimentos.map((proc) => ({
                    procedimento: { connect: { id: proc.id } },
                    valor_cobrado: proc.valor,
                })),
            };
        }
        return this.prisma.agendamento.create({
            data: {
                pacienteId: dto.pacienteId,
                usuarioId: dto.usuarioId,
                clinicaId: usuarioLogado.clinicaId,
                observacao: dto.observacao,
                data_hora_inicio: dataInicio,
                data_hora_fim: dataFim,
                status: client_1.StatusAgendamento.AGENDADO,
                valor_total: valorTotal,
                pago: false,
                procedimentos: Object.keys(createProcedimentosRelation).length > 0
                    ? createProcedimentosRelation
                    : undefined,
            },
            include: {
                procedimentos: { include: { procedimento: true } },
            }
        });
    }
    async findAll(query, usuarioLogado) {
        const { date, pacienteId, usuarioId } = query;
        const where = {
            clinicaId: usuarioLogado.clinicaId,
        };
        if (date) {
            const start = new Date(date);
            start.setUTCHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setUTCHours(23, 59, 59, 999);
            where.data_hora_inicio = {
                gte: start,
                lte: end,
            };
        }
        if (pacienteId)
            where.pacienteId = +pacienteId;
        if (usuarioId)
            where.usuarioId = +usuarioId;
        return this.prisma.agendamento.findMany({
            where,
            include: {
                paciente: { select: { nome_completo: true, id: true } },
                usuario: { select: { nome_completo: true } },
                procedimentos: {
                    include: { procedimento: { select: { nome: true, valor: true } } }
                },
            },
            orderBy: { data_hora_inicio: 'asc' },
        });
    }
    async update(id, updateDto) {
        const agendamentoAntigo = await this.prisma.agendamento.findUnique({
            where: { id },
            include: { paciente: true }
        });
        if (!agendamentoAntigo)
            throw new Error('Agendamento não encontrado');
        return await this.prisma.$transaction(async (tx) => {
            const agendamentoAtualizado = await tx.agendamento.update({
                where: { id },
                data: {
                    ...updateDto,
                    valor_pago: updateDto.valor_pago !== undefined
                        ? updateDto.valor_pago
                        : agendamentoAntigo.valor_pago
                },
            });
            if (updateDto.pago === true && agendamentoAntigo.pago === false) {
                let categoria = await tx.categoriaFinanceira.findFirst({
                    where: {
                        clinicaId: agendamentoAntigo.clinicaId,
                        tipo: 'RECEITA',
                        nome: { contains: 'Consulta', mode: 'insensitive' }
                    }
                });
                if (!categoria) {
                    categoria = await tx.categoriaFinanceira.findFirst({
                        where: { clinicaId: agendamentoAntigo.clinicaId, tipo: 'RECEITA' }
                    });
                }
                const novaTransacao = await tx.transacaoFinanceira.create({
                    data: {
                        descricao: `Agendamento - ${agendamentoAntigo.paciente.nome_completo}`,
                        valor: updateDto.valor_pago || agendamentoAntigo.valor_total || 0,
                        tipo: 'RECEITA',
                        data_vencimento: new Date(),
                        data_pagamento: new Date(),
                        clinicaId: agendamentoAntigo.clinicaId,
                        categoriaId: categoria ? categoria.id : 0,
                        pacienteId: agendamentoAntigo.pacienteId
                    }
                });
                await tx.agendamento.update({
                    where: { id },
                    data: { transacaoFinanceiraId: novaTransacao.id }
                });
            }
            return agendamentoAtualizado;
        });
    }
    async remove(id, clinicaId) {
        await this.getAgendamento(id, clinicaId);
        return this.prisma.agendamento.delete({
            where: { id },
        });
    }
};
exports.AgendamentosService = AgendamentosService;
exports.AgendamentosService = AgendamentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendamentosService);
//# sourceMappingURL=agendamentos.service.js.map