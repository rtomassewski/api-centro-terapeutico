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
exports.NotasComportamentoController = void 0;
const common_1 = require("@nestjs/common");
const notas_comportamento_service_1 = require("./notas-comportamento.service");
const create_nota_comportamento_dto_1 = require("./dto/create-nota-comportamento.dto");
const update_notas_comportamento_dto_1 = require("./dto/update-notas-comportamento.dto");
const query_nota_comportamento_dto_1 = require("./dto/query-nota-comportamento.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let NotasComportamentoController = class NotasComportamentoController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(createDto, req) {
        return this.service.create(createDto, req.user);
    }
    findAll(query, req) {
        return this.service.findAll(query, req.user);
    }
    findOne(id, req) {
        return this.service.findOne(id, req.user);
    }
    update(id, updateDto, req) {
        return this.service.update(id, updateDto, req.user);
    }
    remove(id, req) {
        return this.service.remove(id, req.user);
    }
};
exports.NotasComportamentoController = NotasComportamentoController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.COORDENADOR, client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nota_comportamento_dto_1.CreateNotaComportamentoDto, Object]),
    __metadata("design:returntype", void 0)
], NotasComportamentoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO, client_1.NomePapel.PSICOLOGO, client_1.NomePapel.TERAPEUTA),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_nota_comportamento_dto_1.QueryNotaComportamentoDto, Object]),
    __metadata("design:returntype", void 0)
], NotasComportamentoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NotasComportamentoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.COORDENADOR, client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_notas_comportamento_dto_1.UpdateNotaComportamentoDto, Object]),
    __metadata("design:returntype", void 0)
], NotasComportamentoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NotasComportamentoController.prototype, "remove", null);
exports.NotasComportamentoController = NotasComportamentoController = __decorate([
    (0, common_1.Controller)('notas-comportamento'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notas_comportamento_service_1.NotasComportamentoService])
], NotasComportamentoController);
//# sourceMappingURL=notas-comportamento.controller.js.map