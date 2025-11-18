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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesController = void 0;
const prescricoes_service_1 = require("../prescricoes/prescricoes.service");
const create_prescricao_dto_1 = require("../prescricoes/dto/create-prescricao.dto");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const pacientes_service_1 = require("./pacientes.service");
const create_paciente_dto_1 = require("./dto/create-paciente.dto");
const update_paciente_dto_1 = require("./dto/update-paciente.dto");
const evolucoes_service_1 = require("../evolucoes/evolucoes.service");
const create_evolucao_dto_1 = require("../evolucoes/dto/create-evolucao.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const common_2 = require("@nestjs/common");
const check_in_paciente_dto_1 = require("./dto/check-in-paciente.dto");
const query_paciente_dto_1 = require("./dto/query-paciente.dto");
const historico_medico_service_1 = require("../historico-medico/historico-medico.service");
const create_historico_medico_dto_1 = require("../historico-medico/dto/create-historico-medico.dto");
const update_historico_medico_dto_1 = require("../historico-medico/dto/update-historico-medico.dto");
let PacientesController = class PacientesController {
    pacientesService;
    evolucoesService;
    prescricoesService;
    historicoMedicoService;
    constructor(pacientesService, evolucoesService, prescricoesService, historicoMedicoService) {
        this.pacientesService = pacientesService;
        this.evolucoesService = evolucoesService;
        this.prescricoesService = prescricoesService;
        this.historicoMedicoService = historicoMedicoService;
    }
    create(createPacienteDto, req) {
        return this.pacientesService.create(createPacienteDto, req.user);
    }
    findAll(req, query) {
        return this.pacientesService.findAll(query, req.user);
    }
    findOne(pacienteId, req) {
        return this.pacientesService.findOne(pacienteId, req.user);
    }
    update(pacienteId, updatePacienteDto, req) {
        return this.pacientesService.update(pacienteId, updatePacienteDto, req.user);
    }
    checkIn(pacienteId, dto, req) {
        return this.pacientesService.checkIn(pacienteId, dto, req.user);
    }
    checkOut(pacienteId, req) {
        return this.pacientesService.checkOut(pacienteId, req.user);
    }
    createHistorico(pacienteId, dto, req) {
        return this.historicoMedicoService.create(pacienteId, dto, req.user);
    }
    getHistorico(pacienteId, req) {
        return this.historicoMedicoService.findAllByPacienteId(pacienteId, req.user);
    }
    updateHistorico(pacienteId, dto, req) {
        return this.historicoMedicoService.update(pacienteId, dto, req.user);
    }
    async createEvolucao(pacienteId, dto, req) {
        return this.evolucoesService.create(dto, pacienteId, req.user);
    }
    async findEvolucoes(pacienteId, req) {
        return this.evolucoesService.findAllByPaciente(pacienteId, req.user);
    }
    async createPrescricao(pacienteId, dto, req) {
        const usuarioLogadoId = req.user.id;
        return this.prescricoesService.create(dto, pacienteId, usuarioLogadoId);
    }
    async findPrescricoes(pacienteId, req) {
        return this.prescricoesService.findAllByPaciente(pacienteId, req.user);
    }
};
exports.PacientesController = PacientesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_paciente_dto_1.CreatePacienteDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO, client_1.NomePapel.ATENDENTE, client_1.NomePapel.PSICOLOGO, client_1.NomePapel.TERAPEUTA, client_1.NomePapel.COORDENADOR),
    __param(0, (0, common_2.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_paciente_dto_1.QueryPacienteDto]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO, client_1.NomePapel.ATENDENTE, client_1.NomePapel.PSICOLOGO, client_1.NomePapel.TERAPEUTA, client_1.NomePapel.COORDENADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_paciente_dto_1.UpdatePacienteDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/check-in'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, check_in_paciente_dto_1.CheckInPacienteDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Patch)(':id/check-out'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Post)(':id/historico'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.MEDICO, client_1.NomePapel.ENFERMEIRO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_historico_medico_dto_1.CreateHistoricoMedicoDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "createHistorico", null);
__decorate([
    (0, common_1.Get)(':id/historico'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.MEDICO, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.PSICOLOGO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "getHistorico", null);
__decorate([
    (0, common_1.Patch)(':id/historico'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.MEDICO, client_1.NomePapel.ENFERMEIRO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_historico_medico_dto_1.UpdateHistoricoMedicoDto, Object]),
    __metadata("design:returntype", void 0)
], PacientesController.prototype, "updateHistorico", null);
__decorate([
    (0, common_1.Post)(':id/evolucoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_evolucao_dto_1.CreateEvolucaoDto, Object]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "createEvolucao", null);
__decorate([
    (0, common_1.Get)(':id/evolucoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "findEvolucoes", null);
__decorate([
    (0, common_1.Post)(':id/prescricoes'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.MEDICO),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_prescricao_dto_1.CreatePrescricaoDto, Object]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "createPrescricao", null);
__decorate([
    (0, common_1.Get)(':id/prescricoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_2.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "findPrescricoes", null);
exports.PacientesController = PacientesController = __decorate([
    (0, common_1.Controller)('pacientes'),
    __metadata("design:paramtypes", [pacientes_service_1.PacientesService,
        evolucoes_service_1.EvolucoesService,
        prescricoes_service_1.PrescricoesService,
        historico_medico_service_1.HistoricoMedicoService])
], PacientesController);
//# sourceMappingURL=pacientes.controller.js.map