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
exports.LicencasController = void 0;
const common_1 = require("@nestjs/common");
const licencas_service_1 = require("./licencas.service");
const update_licenca_dto_1 = require("./dto/update-licenca.dto");
const api_key_guard_1 = require("../auth/api-key.guard");
let LicencasController = class LicencasController {
    licencasService;
    constructor(licencasService) {
        this.licencasService = licencasService;
    }
    findAll() {
        return this.licencasService.findAll();
    }
    findOne(id) {
        return this.licencasService.findOne(id);
    }
    update(id, updateLicencaDto) {
        return this.licencasService.update(id, updateLicencaDto);
    }
};
exports.LicencasController = LicencasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LicencasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LicencasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_licenca_dto_1.UpdateLicencaDto]),
    __metadata("design:returntype", void 0)
], LicencasController.prototype, "update", null);
exports.LicencasController = LicencasController = __decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Controller)('licencas'),
    __metadata("design:paramtypes", [licencas_service_1.LicencasService])
], LicencasController);
//# sourceMappingURL=licencas.controller.js.map