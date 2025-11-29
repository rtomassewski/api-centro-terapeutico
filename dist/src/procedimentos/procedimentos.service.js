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
exports.ProcedimentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProcedimentosService = class ProcedimentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, clinicaId) {
        return this.prisma.procedimento.create({
            data: {
                ...createDto,
                clinicaId: clinicaId,
                ativo: createDto.ativo ?? true,
            },
        });
    }
    async findAll(clinicaId, apenasAtivos = false) {
        const where = { clinicaId };
        if (apenasAtivos) {
            where.ativo = true;
        }
        return this.prisma.procedimento.findMany({
            where,
            orderBy: { nome: 'asc' },
        });
    }
    async findOne(id, clinicaId) {
        const procedimento = await this.prisma.procedimento.findFirst({
            where: { id, clinicaId },
        });
        if (!procedimento) {
            throw new common_1.NotFoundException('Procedimento não encontrado.');
        }
        return procedimento;
    }
    async update(id, clinicaId, updateDto) {
        await this.findOne(id, clinicaId);
        return this.prisma.procedimento.update({
            where: { id },
            data: updateDto,
        });
    }
    async remove(id, clinicaId) {
        await this.findOne(id, clinicaId);
        try {
            return await this.prisma.procedimento.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Não é possível excluir este procedimento pois ele já está vinculado a agendamentos. Tente inativá-lo.');
        }
    }
};
exports.ProcedimentosService = ProcedimentosService;
exports.ProcedimentosService = ProcedimentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProcedimentosService);
//# sourceMappingURL=procedimentos.service.js.map