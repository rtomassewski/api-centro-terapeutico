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
                        usuario: { select: { nome_completo: true, registro_conselho: true } }
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
            const response = await axios_1.default.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                }
            });
            return Buffer.from(response.data);
        }
        catch (error) {
            console.error('Erro ao buscar logo (falha de rede ou URL inválido):', error.message);
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
        const headerXLogo = 160;
        const headerXSemLogo = 50;
        if (logoBuffer) {
            try {
                doc.image(logoBuffer, 50, headerY, { width: 100 });
                doc.fontSize(18).text(clinica.nome_fantasia || '', headerXLogo, headerY + 10);
                doc.fontSize(10).text(clinica.endereco || '', headerXLogo, headerY + 35);
                doc.fontSize(10).text(clinica.telefone || '', headerXLogo, headerY + 50);
            }
            catch (e) {
                doc.fontSize(18).text(clinica.nome_fantasia || '', headerXSemLogo, headerY + 10);
                doc.fontSize(10).text(clinica.endereco || '', headerXSemLogo, headerY + 35);
                doc.fontSize(10).text(clinica.telefone || '', headerXSemLogo, headerY + 50);
            }
        }
        else {
            doc.fontSize(18).text(clinica.nome_fantasia || '', headerXSemLogo, headerY + 10);
            doc.fontSize(10).text(clinica.endereco || '', headerXSemLogo, headerY + 35);
            doc.fontSize(10).text(clinica.telefone || '', headerXSemLogo, headerY + 50);
        }
        doc.moveDown(4);
        doc.fontSize(16).text(`Prontuário do Paciente`, { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(12).text(`Paciente: ${paciente.nome_completo}`, { continued: true });
        doc.text(` (ID: ${paciente.id})`);
        doc.text(`CPF: ${paciente.cpf}`);
        doc.text(`Data Nasc.: ${new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}`);
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
        doc.fontSize(14).text('Histórico Médico', { underline: true });
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
        doc.fontSize(14).text('Evoluções', { underline: true });
        doc.moveDown(0.5);
        const evolucoesVisiveis = dados.evolucoes.filter((evolucao) => tiposVisiveis.includes(evolucao.tipo));
        for (const evolucao of evolucoesVisiveis) {
            const data = new Date(evolucao.data_evolucao).toLocaleString('pt-BR');
            doc.fontSize(10).fillColor('black');
            doc.text(`[${evolucao.tipo}] - ${data} - ${evolucao.usuario.nome_completo} (${evolucao.usuario.papel.nome})`);
            doc.fontSize(10).fillColor('gray').text(evolucao.descricao);
            doc.moveDown(0.5);
        }
        doc.moveDown(1);
        doc.fontSize(14).text('Prescrições Ativas', { underline: true });
        doc.moveDown(0.5);
        const prescricoesAtivas = dados.prescricoes.filter((p) => p.ativa);
        if (prescricoesAtivas.length === 0) {
            doc.fontSize(10).fillColor('gray').text('Nenhuma prescrição ativa encontrada.');
        }
        else {
            for (const prescricao of prescricoesAtivas) {
                doc.fontSize(11).fillColor('black').text(prescricao.produto.nome, { continued: true });
                if (prescricao.dosagem) {
                    doc.fontSize(11).text(` (${prescricao.dosagem})`);
                }
                doc.fontSize(10).fillColor('gray').text(`Qtd: ${prescricao.quantidade_por_dose} | Posologia: ${prescricao.posologia}`);
                const medico = prescricao.usuario;
                const registro = medico.registro_conselho ? ` (${medico.registro_conselho})` : '';
                doc.fontSize(9).fillColor('darkgray').text(`Prescrito por: ${medico.nome_completo}${registro}`);
                doc.moveDown(0.5);
            }
        }
        doc.moveDown(1);
        doc.fontSize(14).text('Sinais Vitais Recentes', { underline: true });
        doc.moveDown(0.5);
        if (dados.sinais_vitais.length > 0) {
            const sinal = dados.sinais_vitais[0];
            doc.fontSize(10).fillColor('black').text(`Data: ${sinal.data_hora_afericao.toLocaleString('pt-BR')}`);
            doc.text(`PA: ${sinal.pressao_arterial || '--'} | FC: ${sinal.frequencia_cardiaca || '--'} | Temp: ${sinal.temperatura || '--'}°C`);
            doc.text(`SPO2: ${sinal.saturacao_oxigenio || '--'}% | Dor: ${sinal.dor || '--'} | Glicemia: ${sinal.glicemia || '--'}`);
        }
        else {
            doc.fontSize(10).fillColor('gray').text('Nenhum sinal vital recente.');
        }
        doc.moveDown(1);
        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
    async gerarRelatorioFinanceiro(usuarioLogado, dataInicio, dataFim) {
        const clinicaId = usuarioLogado.clinicaId;
        const clinica = await this.prisma.clinica.findUnique({ where: { id: clinicaId } });
        const where = { clinicaId: clinicaId };
        if (dataInicio && dataFim) {
            where.data_vencimento = {
                gte: new Date(dataInicio),
                lte: new Date(dataFim),
            };
        }
        const transacoes = await this.prisma.transacaoFinanceira.findMany({
            where: where,
            include: { categoria: true, paciente: true },
            orderBy: { data_vencimento: 'asc' },
        });
        let totalReceitas = 0;
        let totalDespesas = 0;
        transacoes.forEach(t => {
            if (t.tipo === client_1.TipoTransacao.RECEITA)
                totalReceitas += Number(t.valor);
            else
                totalDespesas += Number(t.valor);
        });
        const saldo = totalReceitas - totalDespesas;
        const doc = new PDFKit({ size: 'A4', margin: 50 });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        const logoBuffer = await this.getLogoBuffer(clinica.logo_url);
        if (logoBuffer) {
            try {
                doc.image(logoBuffer, 50, 40, { width: 80 });
            }
            catch (e) { }
        }
        doc.fontSize(18).text(clinica.nome_fantasia || '', 150, 50);
        doc.fontSize(12).text('Relatório Financeiro', 150, 75);
        if (dataInicio && dataFim) {
            doc.fontSize(10).text(`Período: ${dataInicio.split('T')[0]} a ${dataFim.split('T')[0]}`, 150, 90);
        }
        else {
            doc.fontSize(10).text(`Período: Geral (Todo o histórico)`, 150, 90);
        }
        doc.moveDown(4);
        doc.fontSize(12).text('Resumo do Período', { underline: true });
        doc.moveDown(0.5);
        doc.fillColor('green').text(`Total Receitas: R$ ${totalReceitas.toFixed(2)}`);
        doc.fillColor('red').text(`Total Despesas: R$ ${totalDespesas.toFixed(2)}`);
        doc.fillColor('black').text(`Saldo Líquido: R$ ${saldo.toFixed(2)}`);
        doc.moveDown(2);
        doc.fontSize(10).text('Data', 50, doc.y, { width: 70 });
        doc.text('Descrição', 130, doc.y, { width: 200 });
        doc.text('Categ.', 340, doc.y, { width: 80 });
        doc.text('Valor (R$)', 430, doc.y, { width: 80, align: 'right' });
        doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke();
        doc.moveDown(1.5);
        for (const t of transacoes) {
            if (doc.y > 750) {
                doc.addPage();
            }
            const dataFormatada = t.data_vencimento.toISOString().split('T')[0].split('-').reverse().join('/');
            const cor = t.tipo === client_1.TipoTransacao.RECEITA ? 'green' : 'red';
            const sinal = t.tipo === client_1.TipoTransacao.RECEITA ? '+' : '-';
            doc.fillColor('black').text(dataFormatada, 50, doc.y, { width: 70 });
            doc.text(t.descricao.substring(0, 35), 130, doc.y, { width: 200 });
            doc.text(t.categoria?.nome || '-', 340, doc.y, { width: 80 });
            doc.fillColor(cor).text(`${sinal} ${Number(t.valor).toFixed(2)}`, 430, doc.y, { width: 80, align: 'right' });
            doc.moveDown(0.8);
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