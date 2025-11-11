"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeitosModule = void 0;
const common_1 = require("@nestjs/common");
const leitos_service_1 = require("./leitos.service");
const leitos_controller_1 = require("./leitos.controller");
const prisma_service_1 = require("../prisma.service");
let LeitosModule = class LeitosModule {
};
exports.LeitosModule = LeitosModule;
exports.LeitosModule = LeitosModule = __decorate([
    (0, common_1.Module)({
        controllers: [leitos_controller_1.LeitosController],
        providers: [leitos_service_1.LeitosService, prisma_service_1.PrismaService],
    })
], LeitosModule);
//# sourceMappingURL=leitos.module.js.map