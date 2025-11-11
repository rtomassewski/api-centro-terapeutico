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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpressoesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const PDFKit = require("pdfkit");
const axios_1 = __importDefault(require("axios"));
let ImpressoesService = class ImpressoesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDadosCompletos(pacienteId, clinicaId) {
        const paciente = await this.prisma.paciente.findFirst({
            where: { id: pacienteId, clinicaId: clinicaId },
            include: {
                clinica: true,
                leito: { include: { quarto: { include: { ala: true } } } },
                historicos_medicos: { include: { usuario_preencheu: true } },
                evolucoes: {
                    include: { usuario: { include: { papel: true } } },
                    orderBy: { data_evolucao: 'desc' }
                },
                prescricoes: {
                    include: {
                        produto: true,
                        usuario: true
                    },
                    orderBy: { data_prescricao: 'desc' }
                },
                sinais_vitais: {
                    include: { usuario_aferiu: true },
                    orderBy: { data_hora_afericao: 'desc' }
                },
                notas_comportamento: {
                    include: { usuario_registrou: true },
                    orderBy: { data_registro: 'desc' }
                },
            },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado');
        }
        return paciente;
    }
    async getLogoBuffer(url) {
        if (!url)
            return null;
        try {
            const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(response.data);
        }
        catch (error) {
            console.error('Erro ao buscar logo:', error.message);
            return null;
        }
    }
    async gerarProntuarioPdf(pacienteId, usuarioLogado) {
        const dados = await this.getDadosCompletos(pacienteId, usuarioLogado.clinicaId);
        const paciente = dados;
        const clinica = dados.clinica;
        console.log("DADOS DA CLINICA PARA O PDF:", clinica);
        const logoBuffer = null;
        const doc = new PDFKit({ size: 'A4', margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.moveDown(2);
        const papelUsuario = usuarioLogado.papel.nome;
        const tiposVisiveis = [client_1.TipoEvolucao.GERAL];
        if (papelUsuario === client_1.NomePapel.PSICOLOGO) {
            tiposVisiveis.push(client_1.TipoEvolucao.PSICOLOGICA);
        }
        if (papelUsuario === client_1.NomePapel.TERAPEUTA) {
            tiposVisiveis.push(client_1.TipoEvolucao.TERAPEUTICA);
        }
        if (papelUsuario === client_1.NomePapel.ADMINISTRADOR ||
            papelUsuario === client_1.NomePapel.COORDENADOR ||
            papelUsuario === client_1.NomePapel.MEDICO) {
            tiposVisiveis.push(client_1.TipoEvolucao.PSICOLOGICA, client_1.TipoEvolucao.TERAPEUTICA);
        }
        doc.fontSize(16).text('Histórico Médico', { underline: true });
        doc.moveDown(0.5);
        const historicosVisiveis = dados.historicos_medicos.filter((h) => tiposVisiveis.includes(h.tipo));
        for (const h of historicosVisiveis) {
            doc.fontSize(10).fillColor('black').text(`HISTÓRICO ${h.tipo}`);
            doc.fontSize(10).fillColor('gray').text(`(Por: ${h.usuario_preencheu.nome_completo})`);
            if (h.alergias)
                doc.fontSize(10).fillColor('black').text(`Alergias: ${h.alergias}`);
            if (h.condicoes_previas)
                doc.fontSize(10).fillColor('black').text(`Condições: ${h.condicoes_previas}`);
            doc.moveDown(0.5);
        }
        doc.moveDown(1);
        doc.fontSize(16).text('Evoluções', { underline: true });
        doc.moveDown(0.5);
        const evolucoesVisiveis = dados.evolucoes.filter((evolucao) => tiposVisiveis.includes(evolucao.tipo));
        for (const evolucao of evolucoesVisiveis) {
            const data = new Date(evolucao.data_evolucao).toLocaleString('pt-BR');
            doc.fontSize(10).fillColor('black');
            doc.text(`[${evolucao.tipo}] - ${data} - ${evolucao.usuario.nome_completo} (${evolucao.usuario.papel.nome})`);
            doc.fontSize(10).fillColor('gray').text(evolucao.descricao);
            doc.moveDown(0.5);
        }
        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
};
exports.ImpressoesService = ImpressoesService;
exports.ImpressoesService = ImpressoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImpressoesService);
//# sourceMappingURL=impressoes.service.js.map