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
exports.PacientesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let PacientesService = class PacientesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, usuarioLogado) {
        try {
            const paciente = await this.prisma.paciente.create({
                data: {
                    nome_completo: dto.nome_completo,
                    nome_social: dto.nome_social,
                    data_nascimento: new Date(dto.data_nascimento),
                    cpf: dto.cpf,
                    nome_responsavel: dto.nome_responsavel,
                    telefone_responsavel: dto.telefone_responsavel,
                    clinicaId: usuarioLogado.clinicaId,
                },
            });
            return paciente;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                if ((error.meta?.target).includes('cpf')) {
                    throw new common_1.ConflictException('Já existe um paciente cadastrado com este CPF.');
                }
            }
            throw error;
        }
    }
    async findAll(query, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        const where = {
            clinicaId: clinicaId,
        };
        if (query.semLeito === 'true') {
            where.leito = null;
        }
        return this.prisma.paciente.findMany({
            where: where,
            select: {
                id: true,
                nome_completo: true,
                nome_social: true,
                data_nascimento: true,
                status: true,
                saldo: true,
            },
            orderBy: {
                nome_completo: 'asc',
            },
        });
    }
    async findOne(pacienteId, usuarioLogado) {
        const paciente = await this.prisma.paciente.findFirst({
            where: {
                id: pacienteId,
                clinicaId: usuarioLogado.clinicaId,
            },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado ou não pertence a esta clínica.');
        }
        return paciente;
    }
    async update(pacienteId, dto, usuarioLogado) {
        await this.findOne(pacienteId, usuarioLogado);
        try {
            return await this.prisma.paciente.update({
                where: {
                    id: pacienteId,
                },
                data: {
                    ...dto,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                if ((error.meta?.target).includes('cpf')) {
                    throw new common_1.ConflictException('Este CPF já está em uso por outro paciente.');
                }
            }
            throw error;
        }
    }
    async checkIn(pacienteId, dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        const paciente = await this.findOne(pacienteId, usuarioLogado);
        const leito = await this.prisma.leito.findFirst({
            where: { id: dto.leitoId, clinicaId: clinicaId },
        });
        if (!leito) {
            throw new common_1.NotFoundException('Leito não encontrado nesta clínica.');
        }
        const leitoAtualPaciente = await this.prisma.leito.findFirst({
            where: { pacienteId: pacienteId, clinicaId: clinicaId },
        });
        if (leitoAtualPaciente) {
            throw new common_1.ConflictException(`Paciente já está alocado no Leito "${leitoAtualPaciente.nome}". Realize o check-out primeiro.`);
        }
        if (leito.status !== client_1.StatusLeito.DISPONIVEL) {
            throw new common_1.ConflictException(`Este leito não está DISPONÍVEL (Status atual: ${leito.status}).`);
        }
        return this.prisma.leito.update({
            where: { id: dto.leitoId },
            data: {
                status: client_1.StatusLeito.OCUPADO,
                pacienteId: pacienteId,
            },
            include: {
                quarto: { select: { nome: true } }
            }
        });
    }
    async checkOut(pacienteId, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.findOne(pacienteId, usuarioLogado);
        const leitoOcupado = await this.prisma.leito.findFirst({
            where: {
                pacienteId: pacienteId,
                clinicaId: clinicaId,
                status: client_1.StatusLeito.OCUPADO,
            },
        });
        if (!leitoOcupado) {
            throw new common_1.NotFoundException('Paciente não encontrado em nenhum leito ocupado.');
        }
        return this.prisma.leito.update({
            where: {
                id: leitoOcupado.id,
            },
            data: {
                status: client_1.StatusLeito.DISPONIVEL,
                pacienteId: null,
            },
        });
    }
};
exports.PacientesService = PacientesService;
exports.PacientesService = PacientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PacientesService);
//# sourceMappingURL=pacientes.service.js.map