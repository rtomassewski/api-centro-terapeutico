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
exports.LeitosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let LeitosService = class LeitosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeito(id, clinicaId) {
        const leito = await this.prisma.leito.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!leito) {
            throw new common_1.NotFoundException('Leito não encontrado nesta clínica.');
        }
        return leito;
    }
    async validarQuarto(quartoId, clinicaId) {
        const quarto = await this.prisma.quarto.findFirst({
            where: { id: quartoId, clinicaId: clinicaId },
        });
        if (!quarto) {
            throw new common_1.NotFoundException('Quarto não encontrado nesta clínica.');
        }
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarQuarto(dto.quartoId, clinicaId);
        return this.prisma.leito.create({
            data: {
                nome: dto.nome,
                quartoId: dto.quartoId,
                clinicaId: clinicaId,
            },
        });
    }
    async findAll(query, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        const where = {
            clinicaId: clinicaId,
        };
        if (query.quartoId) {
            where.quartoId = query.quartoId;
        }
        if (query.status) {
            where.status = query.status;
        }
        return this.prisma.leito.findMany({
            where: where,
            include: {
                quarto: { select: { nome: true } },
                paciente: {
                    select: {
                        nome_completo: true,
                        id: true
                    }
                },
            },
            orderBy: {
                nome: 'asc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        await this.getLeito(id, usuarioLogado.clinicaId);
        return this.prisma.leito.findUnique({
            where: { id: id },
            include: {
                quarto: { include: { ala: true } },
                paciente: true,
            },
        });
    }
    async update(id, dto, usuarioLogado) {
        const leito = await this.getLeito(id, usuarioLogado.clinicaId);
        if (leito.status === client_1.StatusLeito.OCUPADO) {
            throw new common_1.ConflictException("Este leito está OCUPADO. Realize o 'check-out' do paciente antes de movê-lo ou alterar seu status.");
        }
        if (dto.quartoId) {
            await this.validarQuarto(dto.quartoId, usuarioLogado.clinicaId);
        }
        return this.prisma.leito.update({
            where: { id: id },
            data: dto,
        });
    }
    async remove(id, usuarioLogado) {
        const leito = await this.getLeito(id, usuarioLogado.clinicaId);
        if (leito.status === client_1.StatusLeito.OCUPADO) {
            throw new common_1.ConflictException('Este leito não pode ser removido pois está OCUPADO.');
        }
        return this.prisma.leito.delete({
            where: { id: id },
        });
    }
};
exports.LeitosService = LeitosService;
exports.LeitosService = LeitosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeitosService);
//# sourceMappingURL=leitos.service.js.map