// src/prescricoes/prescricoes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePrescricaoDto } from './dto/create-prescricao.dto';
import { Usuario } from '@prisma/client';

@Injectable()
export class PrescricoesService {

  constructor(private prisma: PrismaService) {}
private async validarPaciente(pacienteId: number, clinicaId: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: {
        id: pacienteId,
        clinicaId: clinicaId,
      },
    });

    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado ou não pertence a esta clínica.');
    }
    return paciente;
  }

  async create(
    dto: CreatePrescricaoDto,
    pacienteId: number,
    usuarioLogado: Usuario, // <-- A assinatura CORRETA (3 argumentos)
  ) {
    // Valide
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);
    
    return this.prisma.prescricao.create({
      data: {
        medicamento: dto.medicamento,
        dosagem: dto.dosagem,
        posologia: dto.posologia,
        pacienteId: pacienteId,
        usuarioId: usuarioLogado.id, // <-- Use o ID do objeto
      },
      include: {
        usuario: { select: { nome_completo: true } }
      }
    });
  }

  async findAllByPaciente(pacienteId: number, usuarioLogado: Usuario) {
    // 7. Valide
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);
    return this.prisma.prescricao.findMany({
      where: { pacienteId: pacienteId },
      orderBy: { data_prescricao: 'desc' },
      include: {
        usuario: { select: { nome_completo: true, papel: { select: { nome: true }} } }
      }
    });
  }
}
