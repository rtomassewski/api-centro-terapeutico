"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProcedimentoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_procedimento_dto_1 = require("./create-procedimento.dto");
class UpdateProcedimentoDto extends (0, mapped_types_1.PartialType)(create_procedimento_dto_1.CreateProcedimentoDto) {
}
exports.UpdateProcedimentoDto = UpdateProcedimentoDto;
//# sourceMappingURL=update-procedimento.dto.js.map