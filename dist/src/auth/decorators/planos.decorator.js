"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Planos = exports.PLANOS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PLANOS_KEY = 'planos';
const Planos = (...planos) => (0, common_1.SetMetadata)(exports.PLANOS_KEY, planos);
exports.Planos = Planos;
//# sourceMappingURL=planos.decorator.js.map