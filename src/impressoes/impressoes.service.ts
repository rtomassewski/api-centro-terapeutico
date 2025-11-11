// src/impressoes/impressoes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
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
      console.error('Erro ao buscar logo:', error.message);
      return null;
    }
  }

  /**
   * Gera o PDF do Prontuário Completo
   */
  async gerarProntuarioPdf(
    pacienteId: number,
    usuarioLogado: Usuario,
  ): Promise<Buffer> {
    const dados = await this.getDadosCompletos(pacienteId, usuarioLogado.clinicaId);
    const paciente = dados;
    const clinica = dados.clinica;

    // 1. Tenta buscar o logo (mas não falha se não encontrar)
    const logoBuffer = await this.getLogoBuffer(clinica.logo_url);
    
    // 2. Inicializa o PDFKit
    const doc = new PDFKit({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    
    // 3. Constrói o PDF (em memória)
    doc.on('data', buffers.push.bind(buffers));
    
    // --- Início do Desenho do PDF ---

    // Cabeçalho (com Logo, se existir)
    if (logoBuffer) {
      doc.image(logoBuffer, 50, 40, { width: 100 });
      doc.fontSize(20).text(clinica.nome_fantasia, 160, 50);
    } else {
      doc.fontSize(20).text(clinica.nome_fantasia, 50, 50);
    }
    doc.fontSize(10).text(clinica.endereco || '', { align: 'left' });
    doc.fontSize(10).text(clinica.telefone || '', { align: 'left' });
    
    doc.moveDown(2);
    doc.fontSize(18).text(`Prontuário do Paciente`, { align: 'center' });
    doc.moveDown(1);
    
    // Dados do Paciente
    doc.fontSize(12).text(`Paciente: ${paciente.nome_completo}`, { continued: true });
    doc.text(` (ID: ${paciente.id})`);
    doc.text(`CPF: ${paciente.cpf}`);
    doc.text(`Data Nasc.: ${new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}`);
    doc.moveDown(2);
    
    // Evoluções
    doc.fontSize(16).text('Evoluções', { underline: true });
    doc.moveDown(0.5);
    for (const evolucao of dados.evolucoes) {
      // (Filtra baseado no sigilo - esta lógica é do back-end,
      // mas o front-end precisará ser adaptado para isso)
      // (Por enquanto, vamos assumir que o usuário logado (ex: Médico) pode ver tudo)
      
      const data = new Date(evolucao.data_evolucao).toLocaleString('pt-BR');
      doc.fontSize(10).fillColor('black');
      doc.text(`[${evolucao.tipo}] - ${data} - ${evolucao.usuario.nome_completo} (${evolucao.usuario.papel.nome})`);
      doc.fontSize(10).fillColor('gray').text(evolucao.descricao);
      doc.moveDown(0.5);
    }
    
    // (Adicionar Prescrições, Sinais Vitais, etc. - o padrão é o mesmo)
    
    // --- Fim do Desenho do PDF ---
    
    doc.end();

    // 4. Concatena os buffers e retorna
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}