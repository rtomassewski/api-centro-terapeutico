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
exports.QuartosController = void 0;
const common_1 = require("@nestjs/common");
const quartos_service_1 = require("./quartos.service");
const create_quarto_dto_1 = require("./dto/create-quarto.dto");
const update_quarto_dto_1 = require("./dto/update-quarto.dto");
const query_quarto_dto_1 = require("./dto/query-quarto.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let QuartosController = class QuartosController {
    quartosService;
    constructor(quartosService) {
        this.quartosService = quartosService;
    }
    create(createDto, req) {
        return this.quartosService.create(createDto, req.user);
    }
    findAll(req, query) {
        return this.quartosService.findAll(query, req.user);
    }
    findOne(id, req) {
        return this.quartosService.findOne(id, req.user);
    }
    update(id, updateDto, req) {
        return this.quartosService.update(id, updateDto, req.user);
    }
    remove(id, req) {
        return this.quartosService.remove(id, req.user);
    }
};
exports.QuartosController = QuartosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quarto_dto_1.CreateQuartoDto, Object]),
    __metadata("design:returntype", void 0)
], QuartosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_quarto_dto_1.QueryQuartoDto]),
    __metadata("design:returntype", void 0)
], QuartosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.TECNICO, client_1.NomePapel.MEDICO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QuartosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_quarto_dto_1.UpdateQuartoDto, Object]),
    __metadata("design:returntype", void 0)
], QuartosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QuartosController.prototype, "remove", null);
exports.QuartosController = QuartosController = __decorate([
    (0, common_1.Controller)('quartos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [quartos_service_1.QuartosService])
], QuartosController);
//# sourceMappingURL=quartos.controller.js.map