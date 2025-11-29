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
exports.UpdateAgendamentoDto = exports.FormaPagamento = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_agendamento_dto_1 = require("./create-agendamento.dto");
const class_validator_1 = require("class-validator");
var FormaPagamento;
(function (FormaPagamento) {
    FormaPagamento["DINHEIRO"] = "DINHEIRO";
    FormaPagamento["CARTAO_CREDITO"] = "CARTAO_CREDITO";
    FormaPagamento["CARTAO_DEBITO"] = "CARTAO_DEBITO";
    FormaPagamento["PIX"] = "PIX";
    FormaPagamento["CONVENIO"] = "CONVENIO";
})(FormaPagamento || (exports.FormaPagamento = FormaPagamento = {}));
class UpdateAgendamentoDto extends (0, mapped_types_1.PartialType)(create_agendamento_dto_1.CreateAgendamentoDto) {
    pago;
    forma_pagamento;
    valor_pago;
}
exports.UpdateAgendamentoDto = UpdateAgendamentoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAgendamentoDto.prototype, "pago", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FormaPagamento),
    __metadata("design:type", String)
], UpdateAgendamentoDto.prototype, "forma_pagamento", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateAgendamentoDto.prototype, "valor_pago", void 0);
//# sourceMappingURL=update-agendamento.dto.js.map