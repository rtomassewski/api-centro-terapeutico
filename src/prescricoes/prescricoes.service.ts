// src/prescricoes/prescricoes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePrescricaoDto } from './dto/create-prescricao.dto';

@Injectable()
export class PrescricoesService {

  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreatePrescricaoDto,
    pacienteId: number,
    usuarioId: number,
  ) {
    return this.prisma.prescricao.create({
      data: {
        medicamento: dto.medicamento,
        dosagem: dto.dosagem,
        posologia: dto.posologia,
        pacienteId: pacienteId,
        usuarioId: usuarioId, // O ID do médico logado
      },
      include: {
        usuario: { select: { nome_completo: true } }
      }
    });
  }

  async findAllByPaciente(pacienteId: number) {
    return this.prisma.prescricao.findMany({
      where: { pacienteId: pacienteId },
      orderBy: { data_prescricao: 'desc' },
      include: {
        usuario: { select: { nome_completo: true, papel: { select: { nome: true }} } }
      }
    });
  }
}
