"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricoMedicoModule = void 0;
const common_1 = require("@nestjs/common");
const historico_medico_service_1 = require("./historico-medico.service");
const prisma_service_1 = require("../prisma.service");
let HistoricoMedicoModule = class HistoricoMedicoModule {
};
exports.HistoricoMedicoModule = HistoricoMedicoModule;
exports.HistoricoMedicoModule = HistoricoMedicoModule = __decorate([
    (0, common_1.Module)({
        providers: [historico_medico_service_1.HistoricoMedicoService, prisma_service_1.PrismaService],
        exports: [historico_medico_service_1.HistoricoMedicoService],
    })
], HistoricoMedicoModule);
//# sourceMappingURL=historico-medico.module.js.map