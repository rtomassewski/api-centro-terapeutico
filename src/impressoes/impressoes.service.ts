// src/impressoes/impressoes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NomePapel, TipoEvolucao, Usuario, TipoTransacao } from '@prisma/client';
import PDFKit = require('pdfkit');
import axios from 'axios'; // Para buscar a imagem do logo

@Injectable()
export class ImpressoesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper para buscar todos os dados de um paciente (Completo)
   */
  private async getDadosCompletos(pacienteId: number, clinicaId: number) {
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
            usuario: { select: { nome_completo: true, registro_conselho: true } } // Inclui CRM
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
      throw new NotFoundException('Paciente não encontrado');
    }
    return paciente;
  }

  /**
   * Helper para buscar um buffer de imagem de um URL
   */
  private async getLogoBuffer(url: string | null): Promise<Buffer | null> {
    if (!url) return null;
    try {
      const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        headers: {
          // Adiciona um "disfarce" de navegador para evitar ser bloqueado
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
      });
      return Buffer.from(response.data as ArrayBuffer);
    } catch (error: any) {
      console.error('Erro ao buscar logo (falha de rede ou URL inválido):', error.message);
      return null;
    }
  }

  // --- MÓDULO DE PRONTUÁRIO (gerarProntuarioPdf) ---

  /**
   * Gera o PDF do Prontuário Completo
   */
  async gerarProntuarioPdf(
    pacienteId: number,
    usuarioLogado: any, // Usamos 'any' para o objeto req.user
  ): Promise<Buffer> {
    
    const dados = await this.getDadosCompletos(
      pacienteId,
      usuarioLogado.clinicaId,
    );
    const paciente = dados;
    const clinica = dados.clinica; // Clinica é obrigatório
    
    // O TypeScript agora sabe que 'clinica' é um objeto válido
    const logoBuffer = await this.getLogoBuffer(clinica.logo_url);
    
    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // --- Início do Desenho do PDF ---

    // CABEÇALHO (Logo, Nome da Clínica, Endereço, Telefone)
    const headerY = 40;
    const headerXLogo = 160; 
    const headerXSemLogo = 50; 
    
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 50, headerY, { width: 100 });
        doc.fontSize(18).text(clinica.nome_fantasia || '', headerXLogo, headerY + 10);
        doc.fontSize(10).text(clinica.endereco || '', headerXLogo, headerY + 35);
        doc.fontSize(10).text(clinica.telefone || '', headerXLogo, headerY + 50);
      } catch (e) {
        // Fallback se o PDFKit falhar ao processar a imagem
        doc.fontSize(18).text(clinica.nome_fantasia || '', headerXSemLogo, headerY + 10);
        doc.fontSize(10).text(clinica.endereco || '', headerXSemLogo, headerY + 35);
        doc.fontSize(10).text(clinica.telefone || '', headerXSemLogo, headerY + 50);
      }
    } else {
      // Se não houver logo, desenha o texto na borda
      doc.fontSize(18).text(clinica.nome_fantasia || '', headerXSemLogo, headerY + 10);
      doc.fontSize(10).text(clinica.endereco || '', headerXSemLogo, headerY + 35);
      doc.fontSize(10).text(clinica.telefone || '', headerXSemLogo, headerY + 50);
    }
    
    doc.moveDown(4); 
    doc.fontSize(16).text(`Prontuário do Paciente`, { align: 'center' });
    doc.moveDown(1);
    
    // DADOS DO PACIENTE
    doc.fontSize(12).text(`Paciente: ${paciente.nome_completo}`, { continued: true });
    doc.text(` (ID: ${paciente.id})`);
    doc.text(`CPF: ${paciente.cpf}`);
    doc.text(`Data Nasc.: ${new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}`);
    doc.moveDown(2);
    
    // LÓGICA DE SIGILO
    const papelUsuario = usuarioLogado.papel.nome;
    const tiposVisiveis: TipoEvolucao[] = [TipoEvolucao.GERAL];
    if (papelUsuario === NomePapel.PSICOLOGO) {
      tiposVisiveis.push(TipoEvolucao.PSICOLOGICA);
    }
    if (papelUsuario === NomePapel.TERAPEUTA) {
      tiposVisiveis.push(TipoEvolucao.TERAPEUTICA);
    }
    if (
      papelUsuario === NomePapel.ADMINISTRADOR ||
      papelUsuario === NomePapel.COORDENADOR ||
      papelUsuario === NomePapel.MEDICO
    ) {
      tiposVisiveis.push(TipoEvolucao.PSICOLOGICA, TipoEvolucao.TERAPEUTICA);
    }

    // 1. HISTÓRICO MÉDICO
    doc.fontSize(14).text('Histórico Médico', { underline: true });
    doc.moveDown(0.5);
    const historicosVisiveis = dados.historicos_medicos.filter((h) => 
      tiposVisiveis.includes(h.tipo)
    );
    for (const h of historicosVisiveis) {
      doc.fontSize(10).fillColor('black').text(`HISTÓRICO ${h.tipo}`);
      doc.fontSize(10).fillColor('gray').text(`(Por: ${h.usuario_preencheu.nome_completo})`);
      if(h.alergias) doc.fontSize(10).fillColor('black').text(`Alergias: ${h.alergias}`);
      if(h.condicoes_previas) doc.fontSize(10).fillColor('black').text(`Condições: ${h.condicoes_previas}`);
      doc.moveDown(0.5);
    }
    doc.moveDown(1);
    
    // 2. EVOLUÇÕES
    doc.fontSize(14).text('Evoluções', { underline: true });
    doc.moveDown(0.5);
    const evolucoesVisiveis = dados.evolucoes.filter((evolucao) =>
      tiposVisiveis.includes(evolucao.tipo),
    );
    
    for (const evolucao of evolucoesVisiveis) {
      const data = new Date(evolucao.data_evolucao).toLocaleString('pt-BR');
      doc.fontSize(10).fillColor('black');
      doc.text(`[${evolucao.tipo}] - ${data} - ${evolucao.usuario.nome_completo} (${evolucao.usuario.papel.nome})`);
      doc.fontSize(10).fillColor('gray').text(evolucao.descricao);
      doc.moveDown(0.5);
    }
    doc.moveDown(1);
    
    // 3. PRESCRIÇÕES
    doc.fontSize(14).text('Prescrições Ativas', { underline: true });
    doc.moveDown(0.5);
    const prescricoesAtivas = dados.prescricoes.filter((p) => p.ativa);
    if (prescricoesAtivas.length === 0) {
      doc.fontSize(10).fillColor('gray').text('Nenhuma prescrição ativa encontrada.');
    } else {
      for (const prescricao of prescricoesAtivas) {
        doc.fontSize(11).fillColor('black').text(prescricao.produto.nome, { continued: true });
        if(prescricao.dosagem) {
          doc.fontSize(11).text(` (${prescricao.dosagem})`);
        }
        doc.fontSize(10).fillColor('gray').text(`Qtd: ${prescricao.quantidade_por_dose} | Posologia: ${prescricao.posologia}`);
        const medico = prescricao.usuario;
        // Saída do CRM/Registro do médico prescritor
        const registro = medico.registro_conselho ? ` (${medico.registro_conselho})` : '';
        doc.fontSize(9).fillColor('darkgray').text(`Prescrito por: ${medico.nome_completo}${registro}`);
        doc.moveDown(0.5);
      }
    }
    doc.moveDown(1);
    
    // 4. SINAIS VITAIS (Mostrar o mais recente)
    doc.fontSize(14).text('Sinais Vitais Recentes', { underline: true });
    doc.moveDown(0.5);
    if (dados.sinais_vitais.length > 0) {
        const sinal = dados.sinais_vitais[0]; // Pega o mais recente
        doc.fontSize(10).fillColor('black').text(`Data: ${sinal.data_hora_afericao.toLocaleString('pt-BR')}`);
        doc.text(`PA: ${sinal.pressao_arterial || '--'} | FC: ${sinal.frequencia_cardiaca || '--'} | Temp: ${sinal.temperatura || '--'}°C`);
        doc.text(`SPO2: ${sinal.saturacao_oxigenio || '--'}% | Dor: ${sinal.dor || '--'} | Glicemia: ${sinal.glicemia || '--'}`);
    } else {
        doc.fontSize(10).fillColor('gray').text('Nenhum sinal vital recente.');
    }
    doc.moveDown(1);


    // --- Fim do Desenho do PDF ---
    
    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }


  // --- MÓDULO FINANCEIRO (gerarRelatorioFinanceiro) ---
  
  /**
   * (Módulo Financeiro) Gera o Relatório Financeiro em PDF
   */
  async gerarRelatorioFinanceiro(
    usuarioLogado: any,
    dataInicio?: string,
    dataFim?: string,
  ): Promise<Buffer> {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Busca os dados da Clínica (para o cabeçalho)
    const clinica = await this.prisma.clinica.findUnique({ where: { id: clinicaId } });

    // 2. Filtros de Data
    const where: any = { clinicaId: clinicaId };
    if (dataInicio && dataFim) {
      where.data_vencimento = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim),
      };
    }

    // 3. Busca as Transações
    const transacoes = await this.prisma.transacaoFinanceira.findMany({
      where: where,
      include: { categoria: true, paciente: true },
      orderBy: { data_vencimento: 'asc' },
    });

    // 4. Cálculos
    let totalReceitas = 0;
    let totalDespesas = 0;
    transacoes.forEach(t => {
      if (t.tipo === TipoTransacao.RECEITA) totalReceitas += Number(t.valor);
      else totalDespesas += Number(t.valor);
    });
    const saldo = totalReceitas - totalDespesas;

    // 5. Prepara o PDF
    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // --- Cabeçalho (Reutilizando lógica simples) ---
    const logoBuffer = await this.getLogoBuffer(clinica!.logo_url);
    if (logoBuffer) {
        try { doc.image(logoBuffer, 50, 40, { width: 80 }); } catch(e) {}
    }
    
    // CORREÇÃO: Uso do '!' para satisfazer o TypeScript
    doc.fontSize(18).text(clinica!.nome_fantasia || '', 150, 50);
    doc.fontSize(12).text('Relatório Financeiro', 150, 75);
    
    // CORREÇÃO: Verificação de ambas as datas
    if (dataInicio && dataFim) {
        doc.fontSize(10).text(`Período: ${dataInicio.split('T')[0]} a ${dataFim.split('T')[0]}`, 150, 90);
    } else {
        doc.fontSize(10).text(`Período: Geral (Todo o histórico)`, 150, 90);
    }
    
    doc.moveDown(4);

    // --- Resumo Financeiro ---
    doc.fontSize(12).text('Resumo do Período', { underline: true });
    doc.moveDown(0.5);
    doc.fillColor('green').text(`Total Receitas: R$ ${totalReceitas.toFixed(2)}`);
    doc.fillColor('red').text(`Total Despesas: R$ ${totalDespesas.toFixed(2)}`);
    doc.fillColor('black').text(`Saldo Líquido: R$ ${saldo.toFixed(2)}`);
    doc.moveDown(2);

    // --- Tabela de Transações ---
    // (Desenho manual simples de linhas)
    doc.fontSize(10).text('Data', 50, doc.y, { width: 70 });
    doc.text('Descrição', 130, doc.y, { width: 200 });
    doc.text('Categ.', 340, doc.y, { width: 80 });
    doc.text('Valor (R$)', 430, doc.y, { width: 80, align: 'right' });
    
    doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke(); // Linha
    doc.moveDown(1.5);

    for (const t of transacoes) {
      // Verifica se cabe na página, se não, adiciona nova
      if (doc.y > 750) { doc.addPage(); }

      const dataFormatada = t.data_vencimento.toISOString().split('T')[0].split('-').reverse().join('/');
      const cor = t.tipo === TipoTransacao.RECEITA ? 'green' : 'red';
      const sinal = t.tipo === TipoTransacao.RECEITA ? '+' : '-';

      doc.fillColor('black').text(dataFormatada, 50, doc.y, { width: 70 });
      doc.text(t.descricao.substring(0, 35), 130, doc.y, { width: 200 }); // Limita texto
      doc.text(t.categoria?.nome || '-', 340, doc.y, { width: 80 });
      
      doc.fillColor(cor).text(`${sinal} ${Number(t.valor).toFixed(2)}`, 430, doc.y, { width: 80, align: 'right' });
      
      doc.moveDown(0.8); // Próxima linha
    }

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}