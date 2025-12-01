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
exports.CaixasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let CaixasService = class CaixasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verificarStatusHoje(usuarioId) {
        console.log(`[DEBUG] Verificando caixa para Usuário ID: ${usuarioId}`);
        const caixaAberto = await this.prisma.caixa.findFirst({
            where: {
                usuarioId: usuarioId,
                status: client_1.StatusCaixa.ABERTO,
            },
        });
        console.log(`[DEBUG] Resultado da busca: ${caixaAberto ? 'ACHOU CAIXA ID ' + caixaAberto.id : 'NENHUM CAIXA ABERTO'}`);
        return caixaAberto;
    }
    async abrir(usuarioId, clinicaId, dto) {
        const caixaAberto = await this.verificarStatusHoje(usuarioId);
        if (caixaAberto) {
            throw new common_1.BadRequestException('Você já possui um caixa aberto.');
        }
        return await this.prisma.caixa.create({
            data: {
                usuarioId,
                clinicaId,
                saldo_inicial: dto.saldo_inicial,
                status: client_1.StatusCaixa.ABERTO,
                observacoes: dto.observacoes,
                data_abertura: new Date(),
            },
        });
    }
    async fechar(usuarioId, dto) {
        const caixaAberto = await this.verificarStatusHoje(usuarioId);
        if (!caixaAberto) {
            console.log(`[ERRO] Tentativa de fechar caixa falhou. UsuarioID: ${usuarioId}`);
            throw new common_1.BadRequestException('Não há caixa aberto para fechar.');
        }
        return await this.prisma.caixa.update({
            where: { id: caixaAberto.id },
            data: {
                status: client_1.StatusCaixa.FECHADO,
                saldo_final: dto.saldo_final,
                data_fechamento: new Date(),
            },
        });
    }
};
exports.CaixasService = CaixasService;
exports.CaixasService = CaixasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaixasService);
//# sourceMappingURL=caixas.service.js.map