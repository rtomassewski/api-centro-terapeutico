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
exports.ClinicasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
let ClinicasService = class ClinicasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + 30);
        try {
            const clinica = await this.prisma.$transaction(async (tx) => {
                const novaClinica = await tx.clinica.create({
                    data: {
                        razao_social: dto.razao_social,
                        nome_fantasia: dto.nome_fantasia,
                        cnpj: dto.cnpj,
                        ativa: true,
                    },
                });
                await tx.licenca.create({
                    data: {
                        plano: client_1.TipoPlano.TESTE,
                        status: client_1.StatusLicenca.TESTE,
                        data_expiracao: dataExpiracao,
                        clinicaId: novaClinica.id,
                    },
                });
                return novaClinica;
            });
            return clinica;
        }
        catch (error) {
            if (error instanceof client_2.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                if ((error.meta?.target).includes('cnpj')) {
                    throw new common_1.ConflictException('Já existe uma clínica com este CNPJ.');
                }
            }
            throw error;
        }
    }
    async update(id, dto, usuarioLogado) {
        if (id !== usuarioLogado.clinicaId) {
            throw new common_1.ForbiddenException('Você não tem permissão para editar esta clínica.');
        }
        const { cnpj, ...updateData } = dto;
        return this.prisma.clinica.update({
            where: {
                id: id,
            },
            data: updateData,
        });
    }
};
exports.ClinicasService = ClinicasService;
exports.ClinicasService = ClinicasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicasService);
//# sourceMappingURL=clinicas.service.js.map