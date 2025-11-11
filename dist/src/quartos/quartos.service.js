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
exports.QuartosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let QuartosService = class QuartosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQuarto(id, clinicaId) {
        const quarto = await this.prisma.quarto.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!quarto) {
            throw new common_1.NotFoundException('Quarto não encontrado nesta clínica.');
        }
        return quarto;
    }
    async validarAla(alaId, clinicaId) {
        const ala = await this.prisma.ala.findFirst({
            where: { id: alaId, clinicaId: clinicaId },
        });
        if (!ala) {
            throw new common_1.NotFoundException('Ala não encontrada nesta clínica.');
        }
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarAla(dto.alaId, clinicaId);
        return this.prisma.quarto.create({
            data: {
                nome: dto.nome,
                descricao: dto.descricao,
                alaId: dto.alaId,
                clinicaId: clinicaId,
            },
        });
    }
    async findAll(query, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        const where = {
            clinicaId: clinicaId,
        };
        if (query.alaId) {
            where.alaId = query.alaId;
        }
        return this.prisma.quarto.findMany({
            where: where,
            include: {
                ala: { select: { nome: true } },
            },
            orderBy: {
                nome: 'asc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        await this.getQuarto(id, usuarioLogado.clinicaId);
        return this.prisma.quarto.findUnique({
            where: { id: id },
            include: {
                ala: true,
            },
        });
    }
    async update(id, dto, usuarioLogado) {
        await this.getQuarto(id, usuarioLogado.clinicaId);
        if (dto.alaId) {
            await this.validarAla(dto.alaId, usuarioLogado.clinicaId);
        }
        return this.prisma.quarto.update({
            where: { id: id },
            data: dto,
        });
    }
    async remove(id, usuarioLogado) {
        await this.getQuarto(id, usuarioLogado.clinicaId);
        const leitos = await this.prisma.leito.count({
            where: { quartoId: id },
        });
        if (leitos > 0) {
            throw new common_1.ConflictException('Este quarto não pode ser removido pois contém leitos vinculados.');
        }
        return this.prisma.quarto.delete({
            where: { id: id },
        });
    }
};
exports.QuartosService = QuartosService;
exports.QuartosService = QuartosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuartosService);
//# sourceMappingURL=quartos.service.js.map