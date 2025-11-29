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
exports.ProcedimentosController = void 0;
const common_1 = require("@nestjs/common");
const procedimentos_service_1 = require("./procedimentos.service");
const create_procedimento_dto_1 = require("./dto/create-procedimento.dto");
const update_procedimento_dto_1 = require("./dto/update-procedimento.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ProcedimentosController = class ProcedimentosController {
    procedimentosService;
    constructor(procedimentosService) {
        this.procedimentosService = procedimentosService;
    }
    create(createDto, req) {
        return this.procedimentosService.create(createDto, req.user.clinicaId);
    }
    findAll(req, ativos) {
        const apenasAtivos = ativos === 'true';
        return this.procedimentosService.findAll(req.user.clinicaId, apenasAtivos);
    }
    findOne(id, req) {
        return this.procedimentosService.findOne(+id, req.user.clinicaId);
    }
    update(id, updateDto, req) {
        return this.procedimentosService.update(+id, req.user.clinicaId, updateDto);
    }
    remove(id, req) {
        return this.procedimentosService.remove(+id, req.user.clinicaId);
    }
};
exports.ProcedimentosController = ProcedimentosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_procedimento_dto_1.CreateProcedimentoDto, Object]),
    __metadata("design:returntype", void 0)
], ProcedimentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('ativos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProcedimentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcedimentosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_procedimento_dto_1.UpdateProcedimentoDto, Object]),
    __metadata("design:returntype", void 0)
], ProcedimentosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcedimentosController.prototype, "remove", null);
exports.ProcedimentosController = ProcedimentosController = __decorate([
    (0, common_1.Controller)('procedimentos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [procedimentos_service_1.ProcedimentosService])
], ProcedimentosController);
//# sourceMappingURL=procedimentos.controller.js.map