// src/impressoes/impressoes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NomePapel, TipoEvolucao, Usuario } from '@prisma/client';
import PDFKit = require('pdfkit');
import axios from 'axios'; // Para buscar a imagem do logo

@Injectable()
export class ImpressoesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper para buscar todos os dados de um paciente
   * (Esta é uma consulta ENORME)
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
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data as ArrayBuffer);
    } catch (error) {
      console.error('Erro ao buscar logo (este erro é normal se o URL for inválido ou Google Drive):', error.message);
      return null;
    }
  }

  /**
   * Gera o PDF do Prontuário Completo
   */
  async gerarProntuarioPdf(
    pacienteId: number,
    usuarioLogado: any,
  ): Promise<Buffer> {
    
    const dados = await this.getDadosCompletos(
      pacienteId,
      usuarioLogado.clinicaId,
    );
    const paciente = dados;
    const clinica = dados.clinica;

    // --- CORREÇÃO: O LOGO ESTÁ ATIVADO NOVAMENTE ---
    const logoBuffer = await this.getLogoBuffer(clinica.logo_url);
    
    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // --- Início do Desenho do PDF ---

    // --- CORREÇÃO: O CÓDIGO DE DESENHO DO CABEÇALHO FOI RESTAURADO ---
    const headerY = 40;
    const headerXLogo = 160; // Posição do texto se o logo existir
    const headerXSemLogo = 50; // Posição do texto se não houver logo
    
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 50, headerY, { width: 100 });
        doc.fontSize(18).text(clinica.nome_fantasia || '', headerXLogo, headerY + 10);
        doc.fontSize(10).text(clinica.endereco || '', headerXLogo, headerY + 35);
        doc.fontSize(10).text(clinica.telefone || '', headerXLogo, headerY + 50);
      } catch (e) {
        // (Se o logoBuffer estiver corrompido, desenha sem ele)
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
    
    doc.moveDown(4); // Pula espaço após o cabeçalho
    doc.fontSize(16).text(`Prontuário do Paciente`, { align: 'center' });
    doc.moveDown(1);
    
    // Dados do Paciente
    doc.fontSize(12).text(`Paciente: ${paciente.nome_completo}`, { continued: true });
    doc.text(` (ID: ${paciente.id})`);
    doc.text(`CPF: ${paciente.cpf}`);
    doc.text(`Data Nasc.: ${new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}`);
    doc.moveDown(2);
    // --- FIM DA CORREÇÃO DO CABEÇALHO ---
    
    
    // --- LÓGICA DE SIGILO (Já está correta) ---
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

    // (Histórico Médico - Filtrado)
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
      // (Adicionar outros campos...)
      doc.moveDown(0.5);
    }
    doc.moveDown(1);
    
    // (Evoluções - Filtrado)
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
    
    // (Adicionar Prescrições, Sinais Vitais, Notas de Comportamento...)
    
    // --- Fim do Desenho do PDF ---
    
    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}