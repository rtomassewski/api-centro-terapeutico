// src/historico-medico/historico-medico.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
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
   * CRIAR o Histórico (só pode ter um)
   */
  async create(
    pacienteId: number,
    dto: CreateHistoricoMedicoDto,
    usuarioLogado: Usuario,
  ) {
    const clinicaId = usuarioLogado.clinicaId;
    await this.validarPaciente(pacienteId, clinicaId);

    // 1. REGRA: Verifica se o histórico já existe (relação 1-para-1)
    const historicoExistente = await this.prisma.historicoMedico.findUnique({
      where: { pacienteId: pacienteId },
    });
    if (historicoExistente) {
      throw new ConflictException('Este paciente já possui um histórico médico.');
    }

    // 2. Cria
    return this.prisma.historicoMedico.create({
      data: {
        ...dto,
        clinicaId: clinicaId,
        pacienteId: pacienteId,
        usuarioPreencheuId: usuarioLogado.id, // Auditoria
      },
    });
  }

  /**
   * BUSCAR o Histórico
   */
  async findOneByPacienteId(pacienteId: number, usuarioLogado: Usuario) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    const historico = await this.prisma.historicoMedico.findUnique({
      where: { pacienteId: pacienteId },
      include: {
        usuario_preencheu: { select: { nome_completo: true } },
      },
    });

    if (!historico) {
      throw new NotFoundException('Este paciente ainda não possui histórico médico.');
    }
    return historico;
  }

  /**
   * ATUALIZAR o Histórico
   */
  async update(
    pacienteId: number,
    dto: UpdateHistoricoMedicoDto,
    usuarioLogado: Usuario,
  ) {
    // 1. Valida o paciente e busca o histórico
    const historico = await this.findOneByPacienteId(pacienteId, usuarioLogado);

    // 2. Atualiza
    return this.prisma.historicoMedico.update({
      where: { id: historico.id },
      data: {
        ...dto,
        // (Opcional: atualizar quem e quando foi a *última* edição)
        // usuarioPreencheuId: usuarioLogado.id,
      },
    });
  }
}