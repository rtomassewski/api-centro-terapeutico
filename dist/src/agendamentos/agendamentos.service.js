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
    async validarEntidades(dto, clinicaId) {
        const paciente = await this.prisma.paciente.findFirst({
            where: { id: dto.pacienteId, clinicaId: clinicaId },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado nesta clínica.');
        }
        const profissional = await this.prisma.usuario.findFirst({
            where: { id: dto.usuarioId, clinicaId: clinicaId },
        });
        if (!profissional) {
            throw new common_1.NotFoundException('Profissional não encontrado nesta clínica.');
        }
    }
    async checarConflito(dto, clinicaId) {
        const inicio = new Date(dto.data_hora_inicio);
        const fim = new Date(dto.data_hora_fim);
        if (inicio >= fim) {
            throw new common_1.BadRequestException('A data de início deve ser anterior à data de fim.');
        }
        const conflito = await this.prisma.agendamento.findFirst({
            where: {
                clinicaId: clinicaId,
                usuarioId: dto.usuarioId,
                status: { not: client_1.StatusAgendamento.CANCELADO },
                data_hora_inicio: {
                    lt: fim,
                },
                data_hora_fim: {
                    gt: inicio,
                },
            },
        });
        if (conflito) {
            throw new common_1.ConflictException('Este profissional já possui um agendamento conflitante neste horário.');
        }
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarEntidades(dto, clinicaId);
        await this.checarConflito(dto, clinicaId);
        return this.prisma.agendamento.create({
            data: {
                data_hora_inicio: new Date(dto.data_hora_inicio),
                data_hora_fim: new Date(dto.data_hora_fim),
                notas: dto.notas,
                clinicaId: clinicaId,
                pacienteId: dto.pacienteId,
                usuarioId: dto.usuarioId,
            },
            include: {
                paciente: { select: { nome_completo: true } },
                usuario: { select: { nome_completo: true } },
            },
        });
    }
    async findAll(query, usuarioLogado) {
        const where = {
            clinicaId: usuarioLogado.clinicaId,
            status: { not: client_1.StatusAgendamento.CANCELADO },
        };
        if (query.usuarioId) {
            where.usuarioId = query.usuarioId;
        }
        if (query.pacienteId) {
            where.pacienteId = query.pacienteId;
        }
        if (query.data_inicio && query.data_fim) {
            const inicio = new Date(query.data_inicio);
            const fim = new Date(query.data_fim);
            where.data_hora_inicio = {
                lt: fim,
            };
            where.data_hora_fim = {
                gt: inicio,
            };
        }
        return this.prisma.agendamento.findMany({
            where: where,
            include: {
                paciente: { select: { id: true, nome_completo: true } },
                usuario: { select: { id: true, nome_completo: true } },
            },
            orderBy: {
                data_hora_inicio: 'asc',
            },
        });
    }
    async getAgendamento(id, clinicaId) {
        const agendamento = await this.prisma.agendamento.findFirst({
            where: {
                id: id,
                clinicaId: clinicaId,
            },
        });
        if (!agendamento) {
            throw new common_1.NotFoundException('Agendamento não encontrado ou não pertence a esta clínica.');
        }
        return agendamento;
    }
    async findOne(id, usuarioLogado) {
        return this.getAgendamento(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getAgendamento(id, usuarioLogado.clinicaId);
        const dataInicio = dto.data_hora_inicio
            ? new Date(dto.data_hora_inicio)
            : undefined;
        const dataFim = dto.data_hora_fim
            ? new Date(dto.data_hora_fim)
            : undefined;
        return this.prisma.agendamento.update({
            where: { id: id },
            data: {
                status: dto.status,
                pacienteId: dto.pacienteId,
                usuarioId: dto.usuarioId,
                notas: dto.notas,
                data_hora_inicio: dataInicio,
                data_hora_fim: dataFim,
            },
        });
    }
    async remove(id, usuarioLogado) {
        await this.getAgendamento(id, usuarioLogado.clinicaId);
        return this.prisma.agendamento.delete({
            where: { id: id },
        });
    }
};
exports.AgendamentosService = AgendamentosService;
exports.AgendamentosService = AgendamentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendamentosService);
//# sourceMappingURL=agendamentos.service.js.map