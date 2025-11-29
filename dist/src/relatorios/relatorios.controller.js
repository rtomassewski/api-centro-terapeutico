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
exports.RelatoriosController = void 0;
const common_1 = require("@nestjs/common");
const relatorios_service_1 = require("./relatorios.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const licenca_guard_1 = require("../auth/guards/licenca.guard");
const planos_decorator_1 = require("../auth/decorators/planos.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let RelatoriosController = class RelatoriosController {
    relatoriosService;
    constructor(relatoriosService) {
        this.relatoriosService = relatoriosService;
    }
    getDashboard(req) {
        return this.relatoriosService.getDashboard(req.user);
    }
};
exports.RelatoriosController = RelatoriosController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR),
    (0, planos_decorator_1.Planos)(client_1.TipoPlano.PRO, client_1.TipoPlano.ENTERPRISE, client_1.TipoPlano.TESTE),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RelatoriosController.prototype, "getDashboard", null);
exports.RelatoriosController = RelatoriosController = __decorate([
    (0, common_1.Controller)('relatorios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, licenca_guard_1.LicencaGuard),
    __metadata("design:paramtypes", [relatorios_service_1.RelatoriosService])
], RelatoriosController);
//# sourceMappingURL=relatorios.controller.js.map