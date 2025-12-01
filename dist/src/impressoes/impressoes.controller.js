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
exports.ImpressoesController = void 0;
const common_1 = require("@nestjs/common");
const impressoes_service_1 = require("./impressoes.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let ImpressoesController = class ImpressoesController {
    impressoesService;
    constructor(impressoesService) {
        this.impressoesService = impressoesService;
    }
    async getProntuarioPdf(pacienteId, req, res) {
        const pdfBuffer = await this.impressoesService.gerarProntuarioPdf(pacienteId, req.user);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="prontuario_${pacienteId}.pdf"`,
        });
        res.end(pdfBuffer);
    }
    async getRelatorioFinanceiro(req, res, inicio, fim) {
        const pdfBuffer = await this.impressoesService.gerarRelatorioFinanceiro(req.user, inicio, fim);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="relatorio_financeiro.pdf"`,
        });
        res.end(pdfBuffer);
    }
};
exports.ImpressoesController = ImpressoesController;
__decorate([
    (0, common_1.Get)('paciente/:id/prontuario'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.MEDICO, client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR, client_1.NomePapel.ENFERMEIRO, client_1.NomePapel.PSICOLOGO, client_1.NomePapel.TERAPEUTA, client_1.NomePapel.TECNICO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ImpressoesController.prototype, "getProntuarioPdf", null);
__decorate([
    (0, common_1.Get)('financeiro'),
    (0, roles_decorator_1.Roles)(client_1.NomePapel.ADMINISTRADOR, client_1.NomePapel.COORDENADOR),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('inicio')),
    __param(3, (0, common_1.Query)('fim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ImpressoesController.prototype, "getRelatorioFinanceiro", null);
exports.ImpressoesController = ImpressoesController = __decorate([
    (0, common_1.Controller)('impressoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [impressoes_service_1.ImpressoesService])
], ImpressoesController);
//# sourceMappingURL=impressoes.controller.js.map