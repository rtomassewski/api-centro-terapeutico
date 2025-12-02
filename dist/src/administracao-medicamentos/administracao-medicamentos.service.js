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
exports.AdministracaoMedicamentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let AdministracaoMedicamentosService = class AdministracaoMedicamentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdministracao(id, clinicaId) {
        const administracao = await this.prisma.administracaoMedicamento.findFirst({
            where: { id: id, clinicaId: clinicaId },
        });
        if (!administracao) {
            throw new common_1.NotFoundException('Registro de administração não encontrado ou não pertence a esta clínica.');
        }
        return administracao;
    }
    async validarEntidades(dto, clinicaId) {
        const paciente = await this.prisma.paciente.findFirst({
            where: { id: dto.pacienteId, clinicaId: clinicaId },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado nesta clínica.');
        }
        const prescricao = await this.prisma.prescricao.findFirst({
            where: { id: dto.prescricaoId, pacienteId: dto.pacienteId },
        });
        if (!prescricao) {
            throw new common_1.NotFoundException('Prescrição não encontrada ou não pertence a este paciente.');
        }
    }
    async create(dto, usuarioLogado) {
        const clinicaId = usuarioLogado.clinicaId;
        await this.validarEntidades(dto, clinicaId);
        return this.prisma.administracaoMedicamento.create({
            data: {
                data_hora_prevista: new Date(dto.data_hora_prevista),
                notas: dto.notas,
                status: client_1.StatusAdministracao.PENDENTE,
                clinicaId: clinicaId,
                pacienteId: dto.pacienteId,
                prescricaoId: dto.prescricaoId,
            },
        });
    }
    async administrar(id, dto, usuarioLogado) {
        const administracao = await this.getAdministracao(id, usuarioLogado.clinicaId);
        if (administracao.status !== client_1.StatusAdministracao.PENDENTE) {
            throw new common_1.ConflictException(`Esta medicação já foi processada (Status: ${administracao.status}).`);
        }
        if (dto.status === client_1.StatusAdministracao.ADMINISTRADO &&
            (!dto.quantidade_administrada || dto.quantidade_administrada <= 0)) {
            throw new common_1.BadRequestException('A "quantidade_administrada" é obrigatória e deve ser positiva.');
        }
        const prescricao = await this.prisma.prescricao.findUnique({
            where: { id: administracao.prescricaoId },
            include: { produto: true },
        });
        if (!prescricao || !prescricao.produto) {
            throw new common_1.NotFoundException('Produto ou prescrição não encontrado.');
        }
        const produto = prescricao.produto;
        const quantidade_para_sair = dto.quantidade_administrada || 0;
        if (dto.status === client_1.StatusAdministracao.ADMINISTRADO) {
            if (produto.estoque < quantidade_para_sair) {
                throw new common_1.ConflictException(`Estoque insuficiente para "${produto.nome}". Estoque atual: ${produto.estoque}`);
            }
        }
        try {
            const [saida, adm, produtoAtualizado] = await this.prisma.$transaction(async (tx) => {
                const admAtualizada = await tx.administracaoMedicamento.update({
                    where: { id: id },
                    data: {
                        status: dto.status,
                        notas: dto.notas,
                        data_hora_administracao: new Date(),
                        usuarioAdministrouId: usuarioLogado.id,
                    },
                });
                if (dto.status !== client_1.StatusAdministracao.ADMINISTRADO) {
                    return [null, admAtualizada, null];
                }
                const novaSaida = await tx.saidaEstoque.create({
                    data: {
                        quantidade: quantidade_para_sair,
                        motivo: `Administração Paciente ID ${administracao.pacienteId}`,
                        clinicaId: usuarioLogado.clinicaId,
                        produtoId: produto.id,
                        usuarioId: usuarioLogado.id,
                        administracaoId: id,
                    },
                });
                const produtoNovo = await tx.produto.update({
                    where: { id: produto.id },
                    data: {
                        estoque: {
                            decrement: quantidade_para_sair,
                        },
                    },
                });
                return [novaSaida, admAtualizada, produtoNovo];
            });
            return {
                administracao: adm,
                saida_estoque: saida,
                estoque_atual: produtoAtualizado?.estoque,
            };
        }
        catch (error) {
            throw new common_1.ConflictException(`Falha na transação de estoque: ${error.message}`);
        }
    }
    async findAll(query, usuarioLogado) {
        const where = {
            clinicaId: usuarioLogado.clinicaId,
        };
        if (query.status)
            where.status = query.status;
        if (query.pacienteId)
            where.pacienteId = query.pacienteId;
        if (query.usuarioAdministrouId)
            where.usuarioAdministrouId = query.usuarioAdministrouId;
        if (query.data_inicio && query.data_fim) {
            where.data_hora_prevista = {
                gte: new Date(query.data_inicio),
                lte: new Date(query.data_fim),
            };
        }
        return this.prisma.administracaoMedicamento.findMany({
            where: where,
            include: {
                paciente: { select: { nome_completo: true } },
                prescricao: {
                    select: {
                        dosagem: true,
                        quantidade_por_dose: true,
                        produto: {
                            select: { nome: true },
                        },
                    },
                },
                usuario_administrou: { select: { nome_completo: true } },
            },
            orderBy: {
                data_hora_prevista: 'desc',
            },
        });
    }
    async findOne(id, usuarioLogado) {
        const administracao = await this.getAdministracao(id, usuarioLogado.clinicaId);
        return this.prisma.administracaoMedicamento.findUnique({
            where: { id: administracao.id },
            include: {
                paciente: { select: { nome_completo: true } },
                prescricao: {
                    select: {
                        dosagem: true,
                        posologia: true,
                        produto: {
                            select: { nome: true },
                        },
                    },
                },
                usuario_administrou: { select: { nome_completo: true } },
            },
        });
    }
};
exports.AdministracaoMedicamentosService = AdministracaoMedicamentosService;
exports.AdministracaoMedicamentosService = AdministracaoMedicamentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdministracaoMedicamentosService);
//# sourceMappingURL=administracao-medicamentos.service.js.map