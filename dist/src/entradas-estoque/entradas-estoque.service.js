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
exports.EntradasEstoqueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EntradasEstoqueService = class EntradasEstoqueService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        const produto = await this.prisma.produto.findFirst({
            where: { id: dto.produtoId, clinicaId: clinicaId },
        });
        if (!produto) {
            throw new common_1.NotFoundException('Produto não encontrado nesta clínica.');
        }
        try {
            const [entrada, produtoAtualizado] = await this.prisma.$transaction([
                this.prisma.entradaEstoque.create({
                    data: {
                        quantidade: dto.quantidade,
                        lote: dto.lote,
                        data_validade: dto.data_validade
                            ? new Date(dto.data_validade)
                            : null,
                        clinicaId: clinicaId,
                        produtoId: dto.produtoId,
                        usuarioId: usuarioLogado.id,
                    },
                }),
                this.prisma.produto.update({
                    where: { id: dto.produtoId },
                    data: {
                        quantidade_estoque: {
                            increment: dto.quantidade,
                        },
                    },
                }),
            ]);
            return { entrada, estoque_atual: produtoAtualizado.quantidade_estoque };
        }
        catch (error) {
            throw new Error(`Falha na transação de estoque: ${error.message}`);
        }
    }
    async findAll(query, usuarioLogado) {
        const where = {
            clinicaId: usuarioLogado.clinicaId,
        };
        if (query.produtoId) {
            where.produtoId = query.produtoId;
        }
        return this.prisma.entradaEstoque.findMany({
            where: where,
            include: {
                produto: { select: { nome: true } },
                usuario_registrou: { select: { nome_completo: true } },
            },
            orderBy: {
                data_entrada: 'desc',
            },
        });
    }
    findOne(id) {
        throw new common_1.NotFoundException('Use GET /entradas-estoque?produtoId=...');
    }
    update(id) {
        throw new common_1.NotFoundException('Não é permitido atualizar uma entrada de estoque.');
    }
    remove(id) {
        throw new common_1.NotFoundException('Não é permitido remover uma entrada de estoque.');
    }
};
exports.EntradasEstoqueService = EntradasEstoqueService;
exports.EntradasEstoqueService = EntradasEstoqueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EntradasEstoqueService);
//# sourceMappingURL=entradas-estoque.service.js.map