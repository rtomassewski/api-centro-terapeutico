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
exports.ProdutosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProdutosService = class ProdutosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProduto(id, clinicaId) {
        const produto = await this.prisma.produto.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!produto) {
            throw new common_1.NotFoundException('Produto não encontrado nesta clínica.');
        }
        return produto;
    }
    async create(dto, usuarioLogado) {
        return this.prisma.produto.create({
            data: {
                ...dto,
                clinicaId: usuarioLogado.clinicaId,
                quantidade_estoque: 0,
            },
        });
    }
    async findAll(usuarioLogado) {
        return this.prisma.produto.findMany({
            where: {
                clinicaId: usuarioLogado.clinicaId,
            },
            orderBy: {
                nome: 'asc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        return this.getProduto(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getProduto(id, usuarioLogado.clinicaId);
        return this.prisma.produto.update({
            where: { id: id },
            data: dto,
        });
    }
    async remove(id, usuarioLogado) {
        await this.getProduto(id, usuarioLogado.clinicaId);
        const entradas = await this.prisma.entradaEstoque.count({
            where: { produtoId: id },
        });
        const saidas = await this.prisma.saidaEstoque.count({
            where: { produtoId: id },
        });
        if (entradas > 0 || saidas > 0) {
            throw new common_1.ConflictException('Este produto possui um histórico de estoque (entradas/saídas) e não pode ser removido. Considere desativá-lo.');
        }
        return this.prisma.produto.delete({
            where: { id: id },
        });
    }
};
exports.ProdutosService = ProdutosService;
exports.ProdutosService = ProdutosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProdutosService);
//# sourceMappingURL=produtos.service.js.map