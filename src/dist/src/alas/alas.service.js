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
exports.AlasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AlasService = class AlasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAla(id, clinicaId) {
        const ala = await this.prisma.ala.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!ala) {
            throw new common_1.NotFoundException('Ala não encontrada nesta clínica.');
        }
        return ala;
    }
    async create(dto, usuarioLogado) {
        return this.prisma.ala.create({
            data: {
                ...dto,
                clinicaId: usuarioLogado.clinicaId,
            },
        });
    }
    async findAll(usuarioLogado) {
        return this.prisma.ala.findMany({
            where: {
                clinicaId: usuarioLogado.clinicaId,
            },
            orderBy: {
                nome: 'asc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        return this.getAla(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getAla(id, usuarioLogado.clinicaId);
        return this.prisma.ala.update({
            where: { id: id },
            data: dto,
        });
    }
    async remove(id, usuarioLogado) {
        await this.getAla(id, usuarioLogado.clinicaId);
        const quartos = await this.prisma.quarto.count({
            where: { alaId: id },
        });
        if (quartos > 0) {
            throw new common_1.ConflictException('Esta ala não pode ser removida pois contém quartos vinculados.');
        }
        return this.prisma.ala.delete({
            where: { id: id },
        });
    }
};
exports.AlasService = AlasService;
exports.AlasService = AlasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlasService);
//# sourceMappingURL=alas.service.js.map