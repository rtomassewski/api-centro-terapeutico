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
exports.AdministracaoMedicamentosController = void 0;
const common_1 = require("@nestjs/common");
const administracao_medicamentos_service_1 = require("./administracao-medicamentos.service");
const create_administracao_medicamento_dto_1 = require("./dto/create-administracao-medicamento.dto");
const administrar_medicamento_dto_1 = require("./dto/administrar-medicamento.dto");
const query_administracao_medicamento_dto_1 = require("./dto/query-administracao-medicamento.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let AdministracaoMedicamentosController = class AdministracaoMedicamentosController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(createDto, req) {
        return this.service.create(createDto, req.user);
    }
    administrar(id, dto, req) {
        return this.service.administrar(id, dto, req.user);
    }
    findAll(req, query) {
        return this.service.findAll(query, req.user);
    }
    findOne(id, req) {
        return this.service.findOne(id, req.user);
    }
};
exports.AdministracaoMedicamentosController = AdministracaoMedicamentosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_administracao_medicamento_dto_1.CreateAdministracaoMedicamentoDto, Object]),
    __metadata("design:returntype", void 0)
], AdministracaoMedicamentosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/administrar'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, administrar_medicamento_dto_1.AdministrarMedicamentoDto, Object]),
    __metadata("design:returntype", void 0)
], AdministracaoMedicamentosController.prototype, "administrar", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_administracao_medicamento_dto_1.QueryAdministracaoMedicamentoDto]),
    __metadata("design:returntype", void 0)
], AdministracaoMedicamentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdministracaoMedicamentosController.prototype, "findOne", null);
exports.AdministracaoMedicamentosController = AdministracaoMedicamentosController = __decorate([
    (0, common_1.Controller)('administracao-medicamentos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [administracao_medicamentos_service_1.AdministracaoMedicamentosService])
], AdministracaoMedicamentosController);
//# sourceMappingURL=administracao-medicamentos.controller.js.map