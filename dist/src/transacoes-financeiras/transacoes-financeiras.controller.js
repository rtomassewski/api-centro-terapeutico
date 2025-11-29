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
exports.TransacoesFinanceirasController = void 0;
const common_1 = require("@nestjs/common");
const transacoes_financeiras_service_1 = require("./transacoes-financeiras.service");
const create_transacao_financeira_dto_1 = require("./dto/create-transacao-financeira.dto");
const update_transacao_financeira_dto_1 = require("./dto/update-transacao-financeira.dto");
const query_transacao_financeira_dto_1 = require("./dto/query-transacao-financeira.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const licenca_guard_1 = require("../auth/guards/licenca.guard");
const planos_decorator_1 = require("../auth/decorators/planos.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let TransacoesFinanceirasController = class TransacoesFinanceirasController {
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
exports.TransacoesFinanceirasController = TransacoesFinanceirasController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.PRO, client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transacao_financeira_dto_1.CreateTransacaoFinanceiraDto, Object]),
    __metadata("design:returntype", void 0)
], TransacoesFinanceirasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.PRO, client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_transacao_financeira_dto_1.QueryTransacaoFinanceiraDto, Object]),
    __metadata("design:returntype", void 0)
], TransacoesFinanceirasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.PRO, client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TransacoesFinanceirasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.PRO, client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_transacao_financeira_dto_1.UpdateTransacaoFinanceiraDto, Object]),
    __metadata("design:returntype", void 0)
], TransacoesFinanceirasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.PRO, client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TransacoesFinanceirasController.prototype, "remove", null);
exports.TransacoesFinanceirasController = TransacoesFinanceirasController = __decorate([
    (0, common_1.Controller)('transacoes-financeiras'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, licenca_guard_1.LicencaGuard),
    __metadata("design:paramtypes", [transacoes_financeiras_service_1.TransacoesFinanceirasService])
], TransacoesFinanceirasController);
//# sourceMappingURL=transacoes-financeiras.controller.js.map