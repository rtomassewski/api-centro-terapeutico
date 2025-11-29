"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuartoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_quarto_dto_1 = require("./create-quarto.dto");
class UpdateQuartoDto extends (0, mapped_types_1.PartialType)(create_quarto_dto_1.CreateQuartoDto) {
}
exports.UpdateQuartoDto = UpdateQuartoDto;
//# sourceMappingURL=update-quarto.dto.js.map