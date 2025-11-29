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
exports.PrescricoesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PrescricoesService = class PrescricoesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarPaciente(pacienteId, clinicaId) {
        const paciente = await this.prisma.paciente.findFirst({
            where: {
                id: pacienteId,
                clinicaId: clinicaId,
            },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado ou não pertence a esta clínica.');
        }
        return paciente;
    }
    async create(dto, pacienteId, usuarioId) {
        return this.prisma.prescricao.create({
            data: {
                posologia: dto.posologia,
                dosagem: dto.dosagem,
                quantidade_por_dose: dto.quantidade_por_dose,
                pacienteId: pacienteId,
                usuarioId: usuarioId,
                produtoId: dto.produtoId,
            },
            include: {
                usuario: { select: { nome_completo: true } },
                produto: { select: { nome: true } }
            }
        });
    }
    async findAllByPaciente(pacienteId, usuarioLogado) {
        await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);
        return this.prisma.prescricao.findMany({
            where: { pacienteId: pacienteId },
            orderBy: { data_prescricao: 'desc' },
            include: {
                usuario: { select: { nome_completo: true } },
                produto: {
                    select: { nome: true }
                },
            },
        });
    }
};
exports.PrescricoesService = PrescricoesService;
exports.PrescricoesService = PrescricoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescricoesService);
//# sourceMappingURL=prescricoes.service.js.map