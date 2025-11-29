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
exports.AdministrarMedicamentoDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class AdministrarMedicamentoDto {
    status;
    quantidade_administrada;
    notas;
}
exports.AdministrarMedicamentoDto = AdministrarMedicamentoDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.StatusAdministracao),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([
        client_1.StatusAdministracao.ADMINISTRADO,
        client_1.StatusAdministracao.RECUSADO,
        client_1.StatusAdministracao.NAO_ADMINISTRADO
    ]),
    __metadata("design:type", String)
], AdministrarMedicamentoDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AdministrarMedicamentoDto.prototype, "quantidade_administrada", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdministrarMedicamentoDto.prototype, "notas", void 0);
//# sourceMappingURL=administrar-medicamento.dto.js.map