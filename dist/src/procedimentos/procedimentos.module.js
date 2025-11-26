"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcedimentosModule = void 0;
const common_1 = require("@nestjs/common");
const procedimentos_service_1 = require("./procedimentos.service");
const procedimentos_controller_1 = require("./procedimentos.controller");
const prisma_service_1 = require("../prisma.service");
let ProcedimentosModule = class ProcedimentosModule {
};
exports.ProcedimentosModule = ProcedimentosModule;
exports.ProcedimentosModule = ProcedimentosModule = __decorate([
    (0, common_1.Module)({
        controllers: [procedimentos_controller_1.ProcedimentosController],
        providers: [procedimentos_service_1.ProcedimentosService, prisma_service_1.PrismaService],
    })
], ProcedimentosModule);
//# sourceMappingURL=procedimentos.module.js.map