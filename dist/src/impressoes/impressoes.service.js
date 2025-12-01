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
                historicos_medicos: { include: { usuario_preencheu: true } },
                evolucoes: {
                    include: { usuario: true },
                    orderBy: { data_evolucao: 'desc' }
                },
                prescricoes: {
                    include: {
                        produto: true,
                        usuario: { select: { nome_completo: true, registro_conselho: true } }
                    },
                    orderBy: { data_prescricao: 'desc' }
                },
                sinais_vitais: {
                    include: { usuario_aferiu: true },
                    orderBy: { data_hora_afericao: 'desc' }
                },
            },
        });
        if (!paciente)
            throw new common_1.NotFoundException('Paciente não encontrado');
        return paciente;
    }
    async getLogoBuffer(url) {
        if (!url)
            return null;
        try {
            const response = await axios_1.default.get(url, {
                responseType: 'arraybuffer',
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            return Buffer.from(response.data);
        }
        catch (error) {
            console.log('Não foi possível baixar o logo para o PDF.');
            return null;
        }
    }
    async gerarProntuarioPdf(pacienteId, usuarioLogado) {
        const dados = await this.getDadosCompletos(pacienteId, usuarioLogado.clinicaId);
        const paciente = dados;
        const clinica = dados.clinica;
        const logoBuffer = await this.getLogoBuffer(clinica.logo_url);
        const doc = new PDFKit({ size: 'A4', margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        const headerY = 40;
        const headerXTexto = logoBuffer ? 130 : 50;
        if (logoBuffer) {
            try {
                doc.image(logoBuffer, 50, headerY - 10, { width: 70 });
            }
            catch (e) { }
        }
        doc.fontSize(16).text(clinica.nome_fantasia || 'Clínica Médica', headerXTexto, headerY);
        doc.fontSize(9).fillColor('gray')
            .text(clinica.endereco || '', headerXTexto, headerY + 20)
            .text(`Tel: ${clinica.telefone || '-'}`, headerXTexto, headerY + 32);
        doc.moveDown(3);
        doc.fillColor('black').fontSize(18).text(`Prontuário Médico`, { align: 'center', underline: true });
        doc.moveDown(1);
        doc.rect(50, doc.y, 495, 60).stroke();
        const yBox = doc.y + 10;
        doc.fontSize(12).text(`Paciente:`, 60, yBox);
        doc.font('Helvetica-Bold').text(paciente.nome_completo, 120, yBox);
        doc.font('Helvetica').text(`CPF:`, 60, yBox + 20);
        doc.text(paciente.cpf || 'Não informado', 120, yBox + 20);
        doc.text(`Nascimento:`, 250, yBox + 20);
        doc.text(paciente.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString('pt-BR') : '-', 330, yBox + 20);
        doc.moveDown(4);
        const papelUsuario = usuarioLogado.papel;
        const tiposVisiveis = [client_1.TipoEvolucao.GERAL];
        if (papelUsuario === client_1.NomePapel.PSICOLOGO)
            tiposVisiveis.push(client_1.TipoEvolucao.PSICOLOGICA);
        if (papelUsuario === client_1.NomePapel.TERAPEUTA)
            tiposVisiveis.push(client_1.TipoEvolucao.TERAPEUTICA);
        const papeisComAcessoTotal = [
            client_1.NomePapel.ADMINISTRADOR,
            client_1.NomePapel.COORDENADOR,
            client_1.NomePapel.MEDICO,
            client_1.NomePapel.ENFERMEIRO
        ];
        if (papeisComAcessoTotal.includes(papelUsuario)) {
            tiposVisiveis.push(client_1.TipoEvolucao.PSICOLOGICA, client_1.TipoEvolucao.TERAPEUTICA);
        }
        doc.font('Helvetica-Bold').fontSize(14).text('1. Histórico e Anamnese');
        doc.moveDown(0.5);
        const historicos = dados.historicos_medicos.filter(h => tiposVisiveis.includes(h.tipo));
        if (historicos.length === 0)
            doc.fontSize(10).font('Helvetica').text('Nenhum registro disponível.');
        for (const h of historicos) {
            const dataReg = h['createdAt'] ? new Date(h['createdAt']) : new Date();
            doc.font('Helvetica-Bold').fontSize(10).text(`Tipo: ${h.tipo} - ${dataReg.toLocaleDateString()}`);
            doc.font('Helvetica').text(`Profissional: ${h.usuario_preencheu?.nome_completo || 'Sistema'}`);
            if (h.condicoes_previas)
                doc.text(`Condições: ${h.condicoes_previas}`);
            if (h.alergias)
                doc.text(`Alergias: ${h.alergias}`);
            doc.moveDown(0.5);
        }
        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(14).text('2. Evoluções Clínicas');
        doc.moveDown(0.5);
        const evolucoes = dados.evolucoes.filter(e => tiposVisiveis.includes(e.tipo));
        if (evolucoes.length === 0)
            doc.fontSize(10).font('Helvetica').text('Nenhuma evolução registrada.');
        for (const evo of evolucoes) {
            const data = new Date(evo.data_evolucao).toLocaleString('pt-BR');
            const nomeProf = evo.usuario?.nome_completo || 'Desconhecido';
            doc.fillColor('#003366').fontSize(10).font('Helvetica-Bold')
                .text(`[${evo.tipo}] ${data} - ${nomeProf}`);
            doc.fillColor('black').font('Helvetica').text(evo.descricao);
            doc.moveDown(0.8);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(0.5).strokeColor('#cccccc').stroke();
            doc.moveDown(0.8);
        }
        doc.strokeColor('black');
        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });
    }
    async gerarRelatorioFinanceiro(usuarioLogado, dataInicio, dataFim) {
        const clinicaId = usuarioLogado.clinicaId;
        const clinica = await this.prisma.clinica.findUnique({ where: { id: clinicaId } });
        const where = { clinicaId: clinicaId };
        if (dataInicio && dataFim) {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
            fim.setHours(23, 59, 59, 999);
            where.data_pagamento = {
                gte: inicio,
                lte: fim,
            };
        }
        const transacoes = await this.prisma.transacaoFinanceira.findMany({
            where: where,
            include: { categoria: true },
            orderBy: { data_pagamento: 'asc' },
        });
        let receitas = 0;
        let despesas = 0;
        transacoes.forEach(t => {
            if (t.tipo === client_1.TipoTransacao.RECEITA)
                receitas += Number(t.valor);
            else
                despesas += Number(t.valor);
        });
        const saldo = receitas - despesas;
        const doc = new PDFKit({ size: 'A4', margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        const logoBuffer = await this.getLogoBuffer(clinica?.logo_url || null);
        if (logoBuffer) {
            try {
                doc.image(logoBuffer, 50, 40, { width: 60 });
            }
            catch (e) { }
        }
        doc.fontSize(16).text(clinica?.nome_fantasia || 'Relatório Financeiro', 120, 45);
        doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 120, 65);
        if (dataInicio && dataFim) {
            doc.text(`Período: ${new Date(dataInicio).toLocaleDateString()} até ${new Date(dataFim).toLocaleDateString()}`, 120, 80);
        }
        else {
            doc.text(`Período: Completo`, 120, 80);
        }
        doc.moveDown(4);
        doc.rect(50, doc.y, 495, 40).fillAndStroke('#f0f0f0', '#cccccc');
        doc.fillColor('black').fontSize(12).text(`Receitas: R$ ${receitas.toFixed(2)}`, 70, doc.y - 28, { continued: true });
        doc.text(`   |   Despesas: R$ ${despesas.toFixed(2)}`, { continued: true });
        doc.fillColor(saldo >= 0 ? 'green' : 'red');
        doc.text(`   |   Saldo: R$ ${saldo.toFixed(2)}`);
        doc.moveDown(2);
        doc.fillColor('black').fontSize(10);
        doc.text('Data Pagto', 50, doc.y, { width: 70 });
        doc.text('Descrição', 130, doc.y, { width: 200 });
        doc.text('Cat.', 340, doc.y, { width: 80 });
        doc.text('Valor', 440, doc.y, { width: 80, align: 'right' });
        doc.moveTo(50, doc.y + 12).lineTo(545, doc.y + 12).stroke();
        doc.moveDown(1);
        for (const t of transacoes) {
            if (doc.y > 750)
                doc.addPage();
            const dataShow = t.data_pagamento
                ? t.data_pagamento.toISOString().split('T')[0].split('-').reverse().join('/')
                : '(Aberto)';
            doc.text(dataShow, 50, doc.y, { width: 70 });
            doc.text(t.descricao.substring(0, 35), 130, doc.y, { width: 200 });
            doc.text(t.categoria?.nome || '-', 340, doc.y, { width: 80 });
            const cor = t.tipo === client_1.TipoTransacao.RECEITA ? 'green' : 'red';
            const sinal = t.tipo === client_1.TipoTransacao.RECEITA ? '+' : '-';
            doc.fillColor(cor).text(`${sinal} ${Number(t.valor).toFixed(2)}`, 440, doc.y, { width: 80, align: 'right' });
            doc.fillColor('black');
            doc.moveDown(0.6);
        }
        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });
    }
};
exports.ImpressoesService = ImpressoesService;
exports.ImpressoesService = ImpressoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImpressoesService);
//# sourceMappingURL=impressoes.service.js.map