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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicencaGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const planos_decorator_1 = require("../decorators/planos.decorator");
let LicencaGuard = class LicencaGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const planosExigidos = this.reflector.getAllAndOverride(planos_decorator_1.PLANOS_KEY, [context.getHandler(), context.getClass()]);
        if (!planosExigidos || planosExigidos.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.clinica?.licenca) {
            throw new common_1.ForbiddenException('Licença não encontrada no token.');
        }
        const planoAtual = user.clinica.licenca.plano;
        const temPermissao = planosExigidos.includes(planoAtual);
        if (!temPermissao) {
            throw new common_1.ForbiddenException(`A sua licença (Plano ${planoAtual}) não dá acesso a esta funcionalidade.`);
        }
        return true;
    }
};
exports.LicencaGuard = LicencaGuard;
exports.LicencaGuard = LicencaGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], LicencaGuard);
//# sourceMappingURL=licenca.guard.js.map