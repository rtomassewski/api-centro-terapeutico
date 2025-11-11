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
exports.NotasComportamentoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let NotasComportamentoService = class NotasComportamentoService {
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
    async getNota(id, clinicaId) {
        const nota = await this.prisma.notaComportamento.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!nota) {
            throw new common_1.NotFoundException('Nota não encontrada.');
        }
        return nota;
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarPaciente(dto.pacienteId, clinicaId);
        return this.prisma.notaComportamento.create({
            data: {
                nota: dto.nota,
                observacao: dto.observacao,
                clinicaId: clinicaId,
                pacienteId: dto.pacienteId,
                usuarioRegistrouId: usuarioLogado.id,
            },
        });
    }
    async findAll(query, usuarioLogado) {
        await this.validarPaciente(query.pacienteId, usuarioLogado.clinicaId);
        const where = {
            clinicaId: usuarioLogado.clinicaId,
            pacienteId: query.pacienteId,
        };
        return this.prisma.notaComportamento.findMany({
            where: where,
            include: {
                usuario_registrou: { select: { nome_completo: true } },
            },
            orderBy: {
                data_registro: 'desc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        return this.getNota(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getNota(id, usuarioLogado.clinicaId);
        return this.prisma.notaComportamento.update({
            where: { id: id },
            data: dto,
        });
    }
    async remove(id, usuarioLogado) {
        await this.getNota(id, usuarioLogado.clinicaId);
        return this.prisma.notaComportamento.delete({
            where: { id: id },
        });
    }
};
exports.NotasComportamentoService = NotasComportamentoService;
exports.NotasComportamentoService = NotasComportamentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotasComportamentoService);
//# sourceMappingURL=notas-comportamento.service.js.map