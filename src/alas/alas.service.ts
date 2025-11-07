// src/alas/alas.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAlaDto } from './dto/create-ala.dto';
import { UpdateAlaDto } from './dto/update-ala.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class AlasService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida se a ala existe e pertence à clínica
   */
  private async getAla(id: number, clinicaId: number) {
    const ala = await this.prisma.ala.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!ala) {
      throw new NotFoundException('Ala não encontrada nesta clínica.');
    }
    return ala;
  }

  /**
   * CRIAR uma nova Ala
   */
  async create(dto: CreateAlaDto, usuarioLogado: Usuario) {
    return this.prisma.ala.create({
      data: {
        ...dto,
        clinicaId: usuarioLogado.clinicaId, // Segurança
      },
    });
  }

  /**
   * LISTAR todas as Alas da clínica
   */
  async findAll(usuarioLogado: Usuario) {
    return this.prisma.ala.findMany({
      where: {
        clinicaId: usuarioLogado.clinicaId, // Segurança
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * BUSCAR UMA Ala
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // Helper já faz a validação de segurança
    return this.getAla(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR uma Ala
   */
  async update(id: number, dto: UpdateAlaDto, usuarioLogado: Usuario) {
    // 1. Valida se a ala é da clínica
    await this.getAla(id, usuarioLogado.clinicaId);

    // 2. Atualiza
    return this.prisma.ala.update({
      where: { id: id },
      data: dto,
    });
  }

  /**
   * REMOVER uma Ala
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // 1. Valida se a ala é da clínica
    await this.getAla(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: Não permite excluir se houver quartos
    const quartos = await this.prisma.quarto.count({
      where: { alaId: id },
    });

    if (quartos > 0) {
      throw new ConflictException(
        'Esta ala não pode ser removida pois contém quartos vinculados.',
      );
    }
    
    // 3. Remove
    return this.prisma.ala.delete({
      where: { id: id },
    });
  }
}