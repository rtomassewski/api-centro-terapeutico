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
let AgendamentosService = class AgendamentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAgendamento(agendamentoId, clinicaId) {
        const agendamento = await this.prisma.agendamento.findFirst({
            where: { id: agendamentoId, clinicaId },
        });
        if (!agendamento) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        return agendamento;
    }
    async validarPrestador(prestadorId, clinicaId) {
        const prestador = await this.prisma.usuario.findFirst({
            where: { id: prestadorId, clinicaId: clinicaId, ativo: true },
        });
        if (!prestador) {
            throw new common_1.NotFoundException('Prestador não encontrado ou inativo.');
        }
    }
    async create(dto, usuarioLogado) {
        await this.validarPrestador(dto.usuarioId, usuarioLogado.clinicaId);
        const dataInicio = new Date(dto.data_hora_inicio);
        const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000);
        return this.prisma.agendamento.create({
            data: {
                pacienteId: dto.pacienteId,
                usuarioId: dto.usuarioId,
                clinicaId: usuarioLogado.clinicaId,
                observacao: dto.observacao,
                data_hora_inicio: dataInicio,
                data_hora_fim: dataFim,
            },
        });
    }
    async findAll(query, usuarioLogado) {
        const where = {
            clinicaId: usuarioLogado.clinicaId,
        };
        if (query.date) {
            const dayStart = new Date(query.date);
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
            where.data_hora_inicio = { gte: dayStart, lt: dayEnd };
        }
        return this.prisma.agendamento.findMany({
            where: where,
            include: {
                paciente: { select: { nome_completo: true, id: true } },
                usuario: { select: { nome_completo: true } },
            },
            orderBy: { data_hora_inicio: 'asc' },
        });
    }
    async update(agendamentoId, clinicaId, updateAgendamentoDto) {
        await this.getAgendamento(agendamentoId, clinicaId);
        const { data_hora_inicio, status, ...rest } = updateAgendamentoDto;
        const data = { ...rest };
        if (data_hora_inicio) {
            const novaData = new Date(data_hora_inicio);
            data.data_hora_inicio = novaData;
            data.data_hora_fim = new Date(novaData.getTime() + 60 * 60 * 1000);
        }
        if (status) {
            data.status = status;
        }
        return this.prisma.agendamento.update({
            where: { id: agendamentoId },
            data: data,
            include: {
                paciente: { select: { nome_completo: true } },
                usuario: { select: { nome_completo: true } }
            },
        });
    }
};
exports.AgendamentosService = AgendamentosService;
exports.AgendamentosService = AgendamentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendamentosService);
//# sourceMappingURL=agendamentos.service.js.map