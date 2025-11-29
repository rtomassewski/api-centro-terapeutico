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
exports.CategoriasFinanceirasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CategoriasFinanceirasService = class CategoriasFinanceirasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategoria(id, clinicaId) {
        const categoria = await this.prisma.categoriaFinanceira.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!categoria) {
            throw new common_1.NotFoundException('Categoria não encontrada ou não pertence a esta clínica.');
        }
        return categoria;
    }
    create(dto, usuarioLogado) {
        return this.prisma.categoriaFinanceira.create({
            data: {
                nome: dto.nome,
                tipo: dto.tipo,
                clinicaId: usuarioLogado.clinicaId,
            },
        });
    }
    findAll(usuarioLogado) {
        return this.prisma.categoriaFinanceira.findMany({
            where: {
                clinicaId: usuarioLogado.clinicaId,
            },
            orderBy: {
                nome: 'asc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        return this.getCategoria(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getCategoria(id, usuarioLogado.clinicaId);
        return this.prisma.categoriaFinanceira.update({
            where: { id: id },
            data: dto,
        });
    }
    async remove(id, usuarioLogado) {
        await this.getCategoria(id, usuarioLogado.clinicaId);
        return this.prisma.categoriaFinanceira.delete({
            where: { id: id },
        });
    }
};
exports.CategoriasFinanceirasService = CategoriasFinanceirasService;
exports.CategoriasFinanceirasService = CategoriasFinanceirasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriasFinanceirasService);
//# sourceMappingURL=categorias-financeiras.service.js.map