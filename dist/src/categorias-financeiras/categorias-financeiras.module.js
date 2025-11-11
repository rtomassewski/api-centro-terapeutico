"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasFinanceirasModule = void 0;
const common_1 = require("@nestjs/common");
const categorias_financeiras_service_1 = require("./categorias-financeiras.service");
const categorias_financeiras_controller_1 = require("./categorias-financeiras.controller");
const prisma_service_1 = require("../prisma.service");
let CategoriasFinanceirasModule = class CategoriasFinanceirasModule {
};
exports.CategoriasFinanceirasModule = CategoriasFinanceirasModule;
exports.CategoriasFinanceirasModule = CategoriasFinanceirasModule = __decorate([
    (0, common_1.Module)({
        controllers: [categorias_financeiras_controller_1.CategoriasFinanceirasController],
        providers: [
            categorias_financeiras_service_1.CategoriasFinanceirasService,
            prisma_service_1.PrismaService,
        ],
    })
], CategoriasFinanceirasModule);
//# sourceMappingURL=categorias-financeiras.module.js.map