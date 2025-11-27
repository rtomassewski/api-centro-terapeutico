"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let UsuariosService = class UsuariosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsuario(id, clinicaId) {
        const usuario = await this.prisma.usuario.findFirst({
            where: { id: id, clinicaId: clinicaId },
            select: {
                id: true,
                nome_completo: true,
                email: true,
                ativo: true,
                registro_conselho: true,
                papel: { select: { nome: true } }
            }
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuário não encontrado ou não pertence a esta clínica.');
        }
        return usuario;
    }
    async create(dto) {
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(dto.senha, saltRounds);
        try {
            const usuario = await this.prisma.usuario.create({
                data: {
                    nome_completo: dto.nome_completo,
                    email: dto.email,
                    senha_hash: senhaHash,
                    registro_conselho: dto.registro_conselho,
                    papelId: dto.papelId,
                    ativo: true,
                    clinicaId: dto.clinicaId,
                },
                select: {
                    id: true,
                    nome_completo: true,
                    email: true,
                    ativo: true,
                    papelId: true,
                    createdAt: true,
                }
            });
            return usuario;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                if ((error.meta?.target).includes('email')) {
                    throw new common_1.ConflictException('Este e-mail já está em uso.');
                }
            }
            throw error;
        }
    }
    async findAll(usuarioLogado) {
        return this.prisma.usuario.findMany({
            where: {
                clinicaId: usuarioLogado.clinicaId,
            },
            select: {
                id: true,
                nome_completo: true,
                email: true,
                ativo: true,
                papel: {
                    select: { nome: true }
                }
            },
            orderBy: { nome_completo: 'asc' }
        });
    }
    async findOne(id, usuarioLogado) {
        return this.getUsuario(id, usuarioLogado.clinicaId);
    }
    async update(id, dto, usuarioLogado) {
        await this.getUsuario(id, usuarioLogado.clinicaId);
        return this.prisma.usuario.update({
            where: { id: id },
            data: dto,
            select: {
                id: true,
                nome_completo: true,
                email: true,
                ativo: true,
                papelId: true
            }
        });
    }
    async remove(id, usuarioLogado) {
        await this.getUsuario(id, usuarioLogado.clinicaId);
        if (id === usuarioLogado.id) {
            throw new common_1.ForbiddenException('Um administrador não pode desativar a si mesmo.');
        }
        return this.prisma.usuario.update({
            where: { id: id },
            data: {
                ativo: false,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.usuario.findUnique({
            where: {
                email: email,
            },
            include: {
                papel: true,
                clinica: {
                    include: {
                        licenca: true,
                    },
                },
            },
        });
    }
    async findAllPapeis() {
        return this.prisma.papel.findMany({
            orderBy: { nome: 'asc' },
        });
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map