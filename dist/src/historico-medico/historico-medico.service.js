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
exports.HistoricoMedicoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let HistoricoMedicoService = class HistoricoMedicoService {
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
    async create(pacienteId, dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarPaciente(pacienteId, clinicaId);
        let tipo = client_1.TipoEvolucao.GERAL;
        const papelUsuario = usuarioLogado.papel.nome;
        if (papelUsuario === client_1.NomePapel.PSICOLOGO) {
            tipo = client_1.TipoEvolucao.PSICOLOGICA;
        }
        else if (papelUsuario === client_1.NomePapel.TERAPEUTA) {
            tipo = client_1.TipoEvolucao.TERAPEUTICA;
        }
        const historicoExistente = await this.prisma.historicoMedico.findFirst({
            where: {
                pacienteId: pacienteId,
                tipo: tipo,
            },
        });
        if (historicoExistente) {
            throw new common_1.ConflictException(`Este paciente já possui um histórico do tipo ${tipo}. Use o PATCH para editar.`);
        }
        return this.prisma.historicoMedico.create({
            data: {
                ...dto,
                tipo: tipo,
                clinicaId: clinicaId,
                pacienteId: pacienteId,
                usuarioPreencheuId: usuarioLogado.id,
            },
        });
    }
    async findAllByPacienteId(pacienteId, usuarioLogado) {
        await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);
        const papelUsuario = usuarioLogado.papel.nome;
        const tiposVisiveis = [client_1.TipoEvolucao.GERAL];
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
        const historicos = await this.prisma.historicoMedico.findMany({
            where: {
                pacienteId: pacienteId,
                tipo: { in: tiposVisiveis },
            },
            include: {
                usuario_preencheu: { select: { nome_completo: true } },
            },
            orderBy: {
                data_preenchimento: 'asc'
            }
        });
        if (!historicos || historicos.length === 0) {
            throw new common_1.NotFoundException('Nenhum histórico médico encontrado para este paciente.');
        }
        return historicos;
    }
    async update(historicoId, dto, usuarioLogado) {
        const historico = await this.prisma.historicoMedico.findFirst({
            where: { id: historicoId, clinicaId: usuarioLogado.clinicaId },
        });
        if (!historico) {
            throw new common_1.NotFoundException('Histórico não encontrado.');
        }
        const papelUsuario = usuarioLogado.papel.nome;
        if (historico.usuarioPreencheuId !== usuarioLogado.id &&
            papelUsuario !== client_1.NomePapel.ADMINISTRADOR &&
            papelUsuario !== client_1.NomePapel.COORDENADOR &&
            papelUsuario !== client_1.NomePapel.MEDICO) {
            throw new common_1.ForbiddenException('Você não tem permissão para editar este histórico.');
        }
        return this.prisma.historicoMedico.update({
            where: { id: historicoId },
            data: dto,
        });
    }
};
exports.HistoricoMedicoService = HistoricoMedicoService;
exports.HistoricoMedicoService = HistoricoMedicoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HistoricoMedicoService);
//# sourceMappingURL=historico-medico.service.js.map