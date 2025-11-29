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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("../usuarios/usuarios.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let AuthService = class AuthService {
    usuariosService;
    jwtService;
    prisma;
    constructor(usuariosService, jwtService, prisma) {
        this.usuariosService = usuariosService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, pass) {
        const usuario = await this.usuariosService.findByEmail(email);
        if (usuario) {
            const isMatch = await bcrypt.compare(pass, usuario.senha_hash);
            if (isMatch && usuario.ativo) {
                const { senha_hash, ...result } = usuario;
                return result;
            }
        }
        throw new common_1.UnauthorizedException('E-mail ou senha inválidos.');
    }
    async login(usuario) {
        if (!usuario.clinica?.licenca) {
            throw new common_1.UnauthorizedException('Clínica ou licença não encontrada.');
        }
        const licenca = usuario.clinica.licenca;
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            papelId: usuario.papelId,
            clinicaId: usuario.clinicaId,
            licencaStatus: licenca.status,
            licencaPlano: licenca.plano,
        };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nome: usuario.nome_completo,
                email: usuario.email,
                papelId: usuario.papelId,
                clinicaId: usuario.clinicaId,
                licenca: licenca,
                clinica: usuario.clinica,
            }
        };
    }
    async updatePerfil(userId, dto) {
        return this.prisma.usuario.update({
            where: {
                id: userId,
            },
            data: dto,
            select: {
                id: true,
                nome_completo: true,
                email: true,
                registro_conselho: true,
                assinatura_url: true,
            },
        });
    }
    async createTrial(dto) {
        const emailExists = await this.prisma.usuario.findUnique({
            where: { email: dto.email_admin },
        });
        if (emailExists) {
            throw new common_1.ConflictException('Este e-mail já está em uso.');
        }
        const cnpjExists = await this.prisma.clinica.findUnique({
            where: { cnpj: dto.cnpj },
        });
        if (cnpjExists) {
            throw new common_1.ConflictException('Este CNPJ já está registado.');
        }
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(dto.senha_admin, saltRounds);
        const dataExpiracaoTeste = new Date();
        dataExpiracaoTeste.setDate(dataExpiracaoTeste.getDate() + 30);
        try {
            const [novaClinica, novoUsuario] = await this.prisma.$transaction(async (tx) => {
                const clinica = await tx.clinica.create({
                    data: {
                        nome_fantasia: dto.nome_fantasia,
                        razao_social: `${dto.nome_fantasia} LTDA`,
                        cnpj: dto.cnpj,
                        ativa: true,
                    },
                });
                await tx.licenca.create({
                    data: {
                        plano: client_1.TipoPlano.TESTE,
                        status: client_1.StatusLicenca.TESTE,
                        data_expiracao: dataExpiracaoTeste,
                        clinicaId: clinica.id,
                    },
                });
                const usuario = await tx.usuario.create({
                    data: {
                        nome_completo: dto.nome_admin,
                        email: dto.email_admin,
                        senha_hash: senhaHash,
                        ativo: true,
                        papelId: 1,
                        clinicaId: clinica.id,
                    },
                });
                return [clinica, usuario];
            });
            const usuarioCompleto = await this.usuariosService.findByEmail(novoUsuario.email);
            return this.login(usuarioCompleto);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('E-mail ou CNPJ já registado.');
                }
            }
            throw new common_1.InternalServerErrorException('Erro ao criar a conta de teste.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map