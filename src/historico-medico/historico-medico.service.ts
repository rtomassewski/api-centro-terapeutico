// src/historico-medico/historico-medico.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException, // (Importe este)
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, NomePapel, TipoEvolucao, Usuario } from '@prisma/client';
import { CreateHistoricoMedicoDto } from './dto/create-historico-medico.dto';
import { UpdateHistoricoMedicoDto } from './dto/update-historico-medico.dto';

@Injectable()
export class HistoricoMedicoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida o paciente e a clínica
   */
  private async validarPaciente(pacienteId: number, clinicaId: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id: pacienteId, clinicaId: clinicaId },
    });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado nesta clínica.');
    }
    return paciente;
  }

  /**
   * (CORRIGIDO) CRIAR o Histórico (com etiqueta de sigilo)
   */
  async create(
    pacienteId: number,
    dto: CreateHistoricoMedicoDto,
    usuarioLogado: any, // Usando 'any' para pegar o 'papel'
  ) {
    const clinicaId = usuarioLogado.clinicaId;
    await this.validarPaciente(pacienteId, clinicaId);

    let tipo: TipoEvolucao = TipoEvolucao.GERAL;
    const papelUsuario = usuarioLogado.papel.nome;

    if (papelUsuario === NomePapel.PSICOLOGO) {
      tipo = TipoEvolucao.PSICOLOGICA;
    } else if (papelUsuario === NomePapel.TERAPEUTA) {
      tipo = TipoEvolucao.TERAPEUTICA;
    }
    
    // REGRA: Um paciente só pode ter UM histórico de CADA tipo.
    // CORREÇÃO: Usando 'findFirst' em vez de 'findUnique'
    const historicoExistente = await this.prisma.historicoMedico.findFirst({
      where: { 
        pacienteId: pacienteId,
        tipo: tipo, // Já existe um deste tipo?
      },
    });
    if (historicoExistente) {
      throw new ConflictException(
        `Este paciente já possui um histórico do tipo ${tipo}. Use o PATCH para editar.`,
      );
    }

    return this.prisma.historicoMedico.create({
      data: {
        ...dto,
        tipo: tipo,
        clinicaId: clinicaId,
        pacienteId: pacienteId,
        usuarioPreencheuId: usuarioLogado.id,
      },
    });
  }

  /**
   * (CORRIGIDO) BUSCAR os Históricos (filtrados por sigilo)
   */
  async findAllByPacienteId(pacienteId: number, usuarioLogado: any) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

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

    // CORREÇÃO: Usando 'findMany' em vez de 'findUnique'
    const historicos = await this.prisma.historicoMedico.findMany({
      where: { 
        pacienteId: pacienteId,
        tipo: { in: tiposVisiveis },
      },
      include: {
        usuario_preencheu: { select: { nome_completo: true } },
      },
      orderBy: { // Adicionado 'orderBy'
        data_preenchimento: 'asc'
      }
    });

    if (!historicos || historicos.length === 0) {
      throw new NotFoundException('Nenhum histórico médico encontrado para este paciente.');
    }
    
    return historicos;
  }

  /**
   * (CORRIGIDO) ATUALIZAR o Histórico
   */
  async update(
    historicoId: number,
    dto: UpdateHistoricoMedicoDto,
    usuarioLogado: any,
  ) {
    // 1. Valida o histórico e a clínica (usando 'findFirst')
    const historico = await this.prisma.historicoMedico.findFirst({
      where: { id: historicoId, clinicaId: usuarioLogado.clinicaId },
    });
    if (!historico) {
      throw new NotFoundException('Histórico não encontrado.');
    }

    // 2. REGRA: Só pode editar se for o dono ou um gestor/médico
    const papelUsuario = usuarioLogado.papel.nome;
    if (
      historico.usuarioPreencheuId !== usuarioLogado.id &&
      papelUsuario !== NomePapel.ADMINISTRADOR &&
      papelUsuario !== NomePapel.COORDENADOR &&
      papelUsuario !== NomePapel.MEDICO
    ) {
      throw new ForbiddenException('Você não tem permissão para editar este histórico.');
    }

    // 3. Atualiza
    return this.prisma.historicoMedico.update({
      where: { id: historicoId },
      data: dto,
    });
  }
}