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
exports.AgendamentosController = void 0;
const common_1 = require("@nestjs/common");
const agendamentos_service_1 = require("./agendamentos.service");
const create_agendamento_dto_1 = require("./dto/create-agendamento.dto");
const update_agendamento_dto_1 = require("./dto/update-agendamento.dto");
const query_agendamento_dto_1 = require("./dto/query-agendamento.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AgendamentosController = class AgendamentosController {
    agendamentosService;
    constructor(agendamentosService) {
        this.agendamentosService = agendamentosService;
    }
    async create(createDto, req) {
        return this.agendamentosService.create(createDto, req.user);
    }
    async findAll(query, req) {
        return this.agendamentosService.findAll(query, req.user);
    }
    async update(agendamentoId, req, updateAgendamentoDto) {
        return this.agendamentosService.update(agendamentoId, req.user.clinicaId, updateAgendamentoDto);
    }
};
exports.AgendamentosController = AgendamentosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR, client_1.NomePapel.ATENDENTE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agendamento_dto_1.CreateAgendamentoDto, Object]),
    __metadata("design:returntype", Promise)
], AgendamentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR, client_1.NomePapel.ATENDENTE, client_1.NomePapel.MEDICO),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_agendamento_dto_1.QueryAgendamentoDto, Object]),
    __metadata("design:returntype", Promise)
], AgendamentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR, client_1.NomePapel.ATENDENTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_agendamento_dto_1.UpdateAgendamentoDto]),
    __metadata("design:returntype", Promise)
], AgendamentosController.prototype, "update", null);
exports.AgendamentosController = AgendamentosController = __decorate([
    (0, common_1.Controller)('agendamentos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [agendamentos_service_1.AgendamentosService])
], AgendamentosController);
//# sourceMappingURL=agendamentos.controller.js.map