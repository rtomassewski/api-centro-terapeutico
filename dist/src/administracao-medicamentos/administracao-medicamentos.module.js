"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministracaoMedicamentosModule = void 0;
const common_1 = require("@nestjs/common");
const administracao_medicamentos_service_1 = require("./administracao-medicamentos.service");
const administracao_medicamentos_controller_1 = require("./administracao-medicamentos.controller");
const prisma_service_1 = require("../prisma.service");
let AdministracaoMedicamentosModule = class AdministracaoMedicamentosModule {
};
exports.AdministracaoMedicamentosModule = AdministracaoMedicamentosModule;
exports.AdministracaoMedicamentosModule = AdministracaoMedicamentosModule = __decorate([
    (0, common_1.Module)({
        controllers: [administracao_medicamentos_controller_1.AdministracaoMedicamentosController],
        providers: [administracao_medicamentos_service_1.AdministracaoMedicamentosService, prisma_service_1.PrismaService],
    })
], AdministracaoMedicamentosModule);
//# sourceMappingURL=administracao-medicamentos.module.js.map