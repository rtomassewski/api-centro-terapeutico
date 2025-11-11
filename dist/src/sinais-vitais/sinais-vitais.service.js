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
exports.SinaisVitaisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SinaisVitaisService = class SinaisVitaisService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarPaciente(pacienteId, clinicaId) {
        const paciente = await this.prisma.paciente.findFirst({
            where: { id: pacienteId, clinicaId: clinicaId },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado nesta clínica.');
        }
        return paciente;
    }
    async getSinalVital(id, clinicaId) {
        const sinalVital = await this.prisma.sinalVital.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!sinalVital) {
            throw new common_1.NotFoundException('Registro de Sinal Vital não encontrado.');
        }
        return sinalVital;
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarPaciente(dto.pacienteId, clinicaId);
        return this.prisma.sinalVital.create({
            data: {
                clinicaId: clinicaId,
                pacienteId: dto.pacienteId,
                usuarioAferiuId: usuarioLogado.id,
                data_hora_afericao: dto.data_hora_afericao
                    ? new Date(dto.data_hora_afericao)
                    : new Date(),
                pressao_arterial: dto.pressao_arterial,
                frequencia_cardiaca: dto.frequencia_cardiaca,
                frequencia_respiratoria: dto.frequencia_respiratoria,
                temperatura: dto.temperatura,
                saturacao_oxigenio: dto.saturacao_oxigenio,
                glicemia: dto.glicemia,
                dor: dto.dor,
                notas: dto.notas,
            },
        });
    }
    async findAll(query, usuarioLogado) {
        await this.validarPaciente(query.pacienteId, usuarioLogado.clinicaId);
        const where = {
            clinicaId: usuarioLogado.clinicaId,
            pacienteId: query.pacienteId,
        };
        if (query.data_inicio && query.data_fim) {
            where.data_hora_afericao = {
                gte: new Date(query.data_inicio),
                lte: new Date(query.data_fim),
            };
        }
        return this.prisma.sinalVital.findMany({
            where: where,
            include: {
                usuario_aferiu: { select: { nome_completo: true } },
            },
            orderBy: {
                data_hora_afericao: 'desc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        const sinalVital = await this.getSinalVital(id, usuarioLogado.clinicaId);
        return this.prisma.sinalVital.findUnique({
            where: { id: sinalVital.id },
            include: {
                paciente: { select: { nome_completo: true } },
                usuario_aferiu: { select: { nome_completo: true } },
            }
        });
    }
    async update(id, dto, usuarioLogado) {
        await this.getSinalVital(id, usuarioLogado.clinicaId);
        return this.prisma.sinalVital.update({
            where: { id: id },
            data: {
                ...dto,
                data_hora_afericao: dto.data_hora_afericao
                    ? new Date(dto.data_hora_afericao)
                    : undefined,
            },
        });
    }
    async remove(id, usuarioLogado) {
        await this.getSinalVital(id, usuarioLogado.clinicaId);
        return this.prisma.sinalVital.delete({
            where: { id: id },
        });
    }
};
exports.SinaisVitaisService = SinaisVitaisService;
exports.SinaisVitaisService = SinaisVitaisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SinaisVitaisService);
//# sourceMappingURL=sinais-vitais.service.js.map