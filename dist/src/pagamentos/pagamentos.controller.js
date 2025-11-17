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
exports.PagamentosController = void 0;
const common_1 = require("@nestjs/common");
const pagamentos_service_1 = require("./pagamentos.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const api_key_guard_1 = require("../auth/api-key.guard");
const super_update_licenca_dto_1 = require("./dto/super-update-licenca.dto");
let PagamentosController = class PagamentosController {
    pagamentosService;
    constructor(pagamentosService) {
        this.pagamentosService = pagamentosService;
    }
    async createCheckout(req) {
        return this.pagamentosService.criarCheckout(req.user);
    }
    async receberWebhook(notificacao) {
        return this.pagamentosService.processarWebhook(notificacao);
    }
    async superUpdateLicenca(licencaId, dto) {
        return this.pagamentosService.superUpdateLicenca(licencaId, dto);
    }
};
exports.PagamentosController = PagamentosController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "receberWebhook", null);
__decorate([
    (0, common_1.Patch)('licencas/:id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, super_update_licenca_dto_1.SuperUpdateLicencaDto]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "superUpdateLicenca", null);
exports.PagamentosController = PagamentosController = __decorate([
    (0, common_1.Controller)('pagamentos'),
    __metadata("design:paramtypes", [pagamentos_service_1.PagamentosService])
], PagamentosController);
//# sourceMappingURL=pagamentos.controller.js.map