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
exports.EvolucoesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let EvolucoesService = class EvolucoesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validarPaciente(pacienteId, clinicaId) {
        const paciente = await this.prisma.paciente.findFirst({
            where: { id: pacienteId, clinicaId: clinicaId },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado nesta clínica.');
        }
        return paciente;
    }
    async create(dto, pacienteId, usuarioLogado) {
        await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);
        let tipo = client_1.TipoEvolucao.GERAL;
        const papelUsuario = usuarioLogado.papel.nome;
        if (papelUsuario === client_1.NomePapel.PSICOLOGO) {
            tipo = client_1.TipoEvolucao.PSICOLOGICA;
        }
        else if (papelUsuario === client_1.NomePapel.TERAPEUTA) {
            tipo = client_1.TipoEvolucao.TERAPEUTICA;
        }
        return this.prisma.evolucao.create({
            data: {
                descricao: dto.descricao,
                pacienteId: pacienteId,
                usuarioId: usuarioLogado.id,
                tipo: tipo,
            },
            include: {
                usuario: {
                    select: {
                        nome_completo: true,
                        papel: { select: { nome: true } },
                    },
                },
            },
        });
    }
    async findAllByPaciente(pacienteId, usuarioLogado) {
        await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);
        const papelUsuario = usuarioLogado.papel.nome;
        const tiposVisiveis = [
            client_1.TipoEvolucao.GERAL,
        ];
        if (papelUsuario === client_1.NomePapel.PSICOLOGO) {
            tiposVisiveis.push(client_1.TipoEvolucao.PSICOLOGICA);
        }
        if (papelUsuario === client_1.NomePapel.TERAPEUTA) {
            tiposVisiveis.push(client_1.TipoEvolucao.TERAPEUTICA);
        }
        if (papelUsuario === client_1.NomePapel.ADMINISTRADOR ||
            papelUsuario === client_1.NomePapel.COORDENADOR ||
            papelUsuario === client_1.NomePapel.MEDICO) {
            tiposVisiveis.push(client_1.TipoEvolucao.PSICOLOGICA, client_1.TipoEvolucao.TERAPEUTICA);
        }
        return this.prisma.evolucao.findMany({
            where: {
                pacienteId: pacienteId,
                tipo: {
                    in: tiposVisiveis,
                },
            },
            orderBy: {
                data_evolucao: 'desc',
            },
            include: {
                usuario: {
                    select: {
                        nome_completo: true,
                        papel: { select: { nome: true } },
                    },
                },
            },
        });
    }
};
exports.EvolucoesService = EvolucoesService;
exports.EvolucoesService = EvolucoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvolucoesService);
//# sourceMappingURL=evolucoes.service.js.map