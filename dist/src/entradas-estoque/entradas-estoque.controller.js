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
exports.EntradasEstoqueController = void 0;
const common_1 = require("@nestjs/common");
const entradas_estoque_service_1 = require("./entradas-estoque.service");
const create_entradas_estoque_dto_1 = require("./dto/create-entradas-estoque.dto");
const query_entrada_estoque_dto_1 = require("./dto/query-entrada-estoque.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const licenca_guard_1 = require("../auth/guards/licenca.guard");
const planos_decorator_1 = require("../auth/decorators/planos.decorator");
const client_1 = require("@prisma/client");
let EntradasEstoqueController = class EntradasEstoqueController {
    entradasEstoqueService;
    constructor(entradasEstoqueService) {
        this.entradasEstoqueService = entradasEstoqueService;
    }
    create(createDto, req) {
        return this.entradasEstoqueService.create(createDto, req.user);
    }
    findAll(req, query) {
        return this.entradasEstoqueService.findAll(query, req.user);
    }
};
exports.EntradasEstoqueController = EntradasEstoqueController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_entradas_estoque_dto_1.CreateEntradaEstoqueDto, Object]),
    __metadata("design:returntype", void 0)
], EntradasEstoqueController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_entrada_estoque_dto_1.QueryEntradaEstoqueDto]),
    __metadata("design:returntype", void 0)
], EntradasEstoqueController.prototype, "findAll", null);
exports.EntradasEstoqueController = EntradasEstoqueController = __decorate([
    (0, common_1.Controller)('entradas-estoque'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, licenca_guard_1.LicencaGuard),
    __metadata("design:paramtypes", [entradas_estoque_service_1.EntradasEstoqueService])
], EntradasEstoqueController);
//# sourceMappingURL=entradas-estoque.controller.js.map