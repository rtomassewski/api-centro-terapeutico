"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSaidasEstoqueDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_saidas_estoque_dto_1 = require("./create-saidas-estoque.dto");
class UpdateSaidasEstoqueDto extends (0, mapped_types_1.PartialType)(create_saidas_estoque_dto_1.CreateSaidaEstoqueDto) {
}
exports.UpdateSaidasEstoqueDto = UpdateSaidasEstoqueDto;
//# sourceMappingURL=update-saidas-estoque.dto.js.map