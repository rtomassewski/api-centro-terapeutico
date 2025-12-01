// src/impressoes/impressoes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NomePapel, TipoEvolucao, TipoTransacao } from '@prisma/client';
import PDFKit = require('pdfkit');
import axios from 'axios';

@Injectable()
export class ImpressoesService {
  constructor(private prisma: PrismaService) {}

  // --- HELPER: Busca Dados Completos do Paciente ---
  private async getDadosCompletos(pacienteId: number, clinicaId: number) {
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

    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    return paciente;
  }

  // --- HELPER: Busca Logo da Web ---
  private async getLogoBuffer(url: string | null): Promise<Buffer | null> {
    if (!url) return null;
    try {
      const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        timeout: 5000, 
        headers: {
          'User-Agent': 'Mozilla/5.0' 
        }
      });
      return Buffer.from(response.data as ArrayBuffer);
    } catch (error) {
      console.log('Não foi possível baixar o logo para o PDF.');
      return null;
    }
  }

  // ========================================================================
  // 1. GERAR PRONTUÁRIO
  // ========================================================================
  async gerarProntuarioPdf(pacienteId: number, usuarioLogado: any): Promise<Buffer> {
    
    const dados = await this.getDadosCompletos(pacienteId, usuarioLogado.clinicaId);
    const paciente = dados;
    const clinica = dados.clinica;
    
    // Busca Logo
    const logoBuffer = await this.getLogoBuffer(clinica.logo_url);
    
    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // --- CABEÇALHO ---
    const headerY = 40;
    const headerXTexto = logoBuffer ? 130 : 50; 
    
    if (logoBuffer) {
        try { doc.image(logoBuffer, 50, headerY - 10, { width: 70 }); } catch(e){}
    }
    
    doc.fontSize(16).text(clinica.nome_fantasia || 'Clínica Médica', headerXTexto, headerY);
    doc.fontSize(9).fillColor('gray')
       .text(clinica.endereco || '', headerXTexto, headerY + 20)
       .text(`Tel: ${clinica.telefone || '-'}`, headerXTexto, headerY + 32);

    doc.moveDown(3);
    
    // --- TÍTULO ---
    doc.fillColor('black').fontSize(18).text(`Prontuário Médico`, { align: 'center', underline: true });
    doc.moveDown(1);
    
    // --- DADOS PACIENTE ---
    doc.rect(50, doc.y, 495, 60).stroke(); // Caixa
    const yBox = doc.y + 10;
    
    doc.fontSize(12).text(`Paciente:`, 60, yBox);
    doc.font('Helvetica-Bold').text(paciente.nome_completo, 120, yBox);
    
    doc.font('Helvetica').text(`CPF:`, 60, yBox + 20);
    doc.text(paciente.cpf || 'Não informado', 120, yBox + 20);
    
    doc.text(`Nascimento:`, 250, yBox + 20);
    doc.text(paciente.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString('pt-BR') : '-', 330, yBox + 20);

    doc.moveDown(4); 

    // --- LÓGICA DE VISIBILIDADE (SIGILO) ---
    const papelUsuario = usuarioLogado.papel; 
    
    const tiposVisiveis: TipoEvolucao[] = [TipoEvolucao.GERAL];
    
    if (papelUsuario === NomePapel.PSICOLOGO) tiposVisiveis.push(TipoEvolucao.PSICOLOGICA);
    if (papelUsuario === NomePapel.TERAPEUTA) tiposVisiveis.push(TipoEvolucao.TERAPEUTICA);
    
    // --- CORREÇÃO AQUI: Cast explicito para NomePapel[] ---
    const papeisComAcessoTotal: NomePapel[] = [
      NomePapel.ADMINISTRADOR, 
      NomePapel.COORDENADOR, 
      NomePapel.MEDICO, 
      NomePapel.ENFERMEIRO
    ];

    if (papeisComAcessoTotal.includes(papelUsuario as NomePapel)) {
      tiposVisiveis.push(TipoEvolucao.PSICOLOGICA, TipoEvolucao.TERAPEUTICA);
    }
    // --------------------------------------------------------

    // 1. HISTÓRICO
    doc.font('Helvetica-Bold').fontSize(14).text('1. Histórico e Anamnese');
    doc.moveDown(0.5);
    const historicos = dados.historicos_medicos.filter(h => tiposVisiveis.includes(h.tipo));
    
    if (historicos.length === 0) doc.fontSize(10).font('Helvetica').text('Nenhum registro disponível.');
    
    for (const h of historicos) {
      // Correção data_registro -> createdAt
      const dataReg = h['createdAt'] ? new Date(h['createdAt']) : new Date();

      doc.font('Helvetica-Bold').fontSize(10).text(`Tipo: ${h.tipo} - ${dataReg.toLocaleDateString()}`);
      doc.font('Helvetica').text(`Profissional: ${h.usuario_preencheu?.nome_completo || 'Sistema'}`);
      if(h.condicoes_previas) doc.text(`Condições: ${h.condicoes_previas}`);
      if(h.alergias) doc.text(`Alergias: ${h.alergias}`);
      doc.moveDown(0.5);
    }
    doc.moveDown(1);
    
    // 2. EVOLUÇÕES
    doc.font('Helvetica-Bold').fontSize(14).text('2. Evoluções Clínicas');
    doc.moveDown(0.5);
    const evolucoes = dados.evolucoes.filter(e => tiposVisiveis.includes(e.tipo));

    if (evolucoes.length === 0) doc.fontSize(10).font('Helvetica').text('Nenhuma evolução registrada.');

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

  // ========================================================================
  // 2. RELATÓRIO FINANCEIRO
  // ========================================================================
  async gerarRelatorioFinanceiro(usuarioLogado: any, dataInicio?: string, dataFim?: string): Promise<Buffer> {
    const clinicaId = usuarioLogado.clinicaId;
    const clinica = await this.prisma.clinica.findUnique({ where: { id: clinicaId } });

    const where: any = { clinicaId: clinicaId };

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
      if (t.tipo === TipoTransacao.RECEITA) receitas += Number(t.valor);
      else despesas += Number(t.valor);
    });
    const saldo = receitas - despesas;

    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    const logoBuffer = await this.getLogoBuffer(clinica?.logo_url || null);
    
    if (logoBuffer) { try { doc.image(logoBuffer, 50, 40, { width: 60 }); } catch(e){} }

    doc.fontSize(16).text(clinica?.nome_fantasia || 'Relatório Financeiro', 120, 45);
    doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 120, 65);
    
    if (dataInicio && dataFim) {
        doc.text(`Período: ${new Date(dataInicio).toLocaleDateString()} até ${new Date(dataFim).toLocaleDateString()}`, 120, 80);
    } else {
        doc.text(`Período: Completo`, 120, 80);
    }

    doc.moveDown(4);

    // Resumo
    doc.rect(50, doc.y, 495, 40).fillAndStroke('#f0f0f0', '#cccccc');
    doc.fillColor('black').fontSize(12).text(`Receitas: R$ ${receitas.toFixed(2)}`, 70, doc.y - 28, { continued: true });
    doc.text(`   |   Despesas: R$ ${despesas.toFixed(2)}`, { continued: true });
    
    doc.fillColor(saldo >= 0 ? 'green' : 'red');
    doc.text(`   |   Saldo: R$ ${saldo.toFixed(2)}`);
    
    doc.moveDown(2);

    // Tabela
    doc.fillColor('black').fontSize(10);
    doc.text('Data Pagto', 50, doc.y, { width: 70 });
    doc.text('Descrição', 130, doc.y, { width: 200 });
    doc.text('Cat.', 340, doc.y, { width: 80 });
    doc.text('Valor', 440, doc.y, { width: 80, align: 'right' });
    
    doc.moveTo(50, doc.y + 12).lineTo(545, doc.y + 12).stroke();
    doc.moveDown(1);

    for (const t of transacoes) {
        if (doc.y > 750) doc.addPage();

        const dataShow = t.data_pagamento 
            ? t.data_pagamento.toISOString().split('T')[0].split('-').reverse().join('/')
            : '(Aberto)';

        doc.text(dataShow, 50, doc.y, { width: 70 });
        doc.text(t.descricao.substring(0, 35), 130, doc.y, { width: 200 });
        doc.text(t.categoria?.nome || '-', 340, doc.y, { width: 80 });
        
        const cor = t.tipo === TipoTransacao.RECEITA ? 'green' : 'red';
        const sinal = t.tipo === TipoTransacao.RECEITA ? '+' : '-';
        doc.fillColor(cor).text(`${sinal} ${Number(t.valor).toFixed(2)}`, 440, doc.y, { width: 80, align: 'right' });
        
        doc.fillColor('black'); 
        doc.moveDown(0.6);
    }

    doc.end();
    return new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}