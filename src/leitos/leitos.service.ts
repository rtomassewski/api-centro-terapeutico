// src/leitos/leitos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateLeitoDto } from './dto/create-leito.dto';
import { UpdateLeitoDto } from './dto/update-leito.dto';
import { QueryLeitoDto } from './dto/query-leito.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, StatusLeito, Usuario } from '@prisma/client';

@Injectable()
export class LeitosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper 1: Valida se o leito existe e pertence à clínica
   */
  private async getLeito(id: number, clinicaId: number) {
    const leito = await this.prisma.leito.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!leito) {
      throw new NotFoundException('Leito não encontrado nesta clínica.');
    }
    return leito;
  }

  /**
   * Helper 2: Valida se o Quarto (pai) existe e pertence à clínica
   */
  private async validarQuarto(quartoId: number, clinicaId: number) {
    const quarto = await this.prisma.quarto.findFirst({
      where: { id: quartoId, clinicaId: clinicaId },
    });
    if (!quarto) {
      throw new NotFoundException('Quarto não encontrado nesta clínica.');
    }
  }

  /**
   * CRIAR um novo Leito
   */
  async create(dto: CreateLeitoDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Valida se o Quarto-pai existe e é da mesma clínica
    await this.validarQuarto(dto.quartoId, clinicaId);

    // 2. Cria o leito (status padrão é DISPONIVEL)
    return this.prisma.leito.create({
      data: {
        nome: dto.nome,
        quartoId: dto.quartoId,
        clinicaId: clinicaId, // Segurança
      },
    });
  }

  /**
   * LISTAR todos os Leitos (com filtros)
   */
  async findAll(query: QueryLeitoDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;
    
    // Filtro base de segurança
    const where: Prisma.LeitoWhereInput = {
      clinicaId: clinicaId,
    };

    // Filtros opcionais da query
    if (query.quartoId) {
      where.quartoId = query.quartoId;
    }
    if (query.status) {
      where.status = query.status;
    }

    return this.prisma.leito.findMany({
      where: where,
      include: {
        quarto: { select: { nome: true } },
        paciente: { select: { nome_completo: true } }, // Mostra quem está no leito
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * BUSCAR UM Leito
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // 1. Valida o leito
    await this.getLeito(id, usuarioLogado.clinicaId);
    
    // 2. Retorna com detalhes
    return this.prisma.leito.findUnique({
      where: { id: id },
      include: { 
        quarto: { include: { ala: true } }, // Inclui Quarto e Ala
        paciente: true, // Inclui o Paciente (se houver)
      },
    });
  }

  /**
   * ATUALIZAR um Leito (Apenas Admin)
   */
  async update(id: number, dto: UpdateLeitoDto, usuarioLogado: Usuario) {
    // 1. Valida se o leito é da clínica
    const leito = await this.getLeito(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: Não permite mudar um leito OCUPADO
    if (leito.status === StatusLeito.OCUPADO) {
      throw new ConflictException(
        "Este leito está OCUPADO. Realize o 'check-out' do paciente antes de movê-lo ou alterar seu status.",
      );
    }
    
    // 3. Se o usuário está tentando MOVER o leito (mudar o quartoId)
    if (dto.quartoId) {
      // Valida se o NOVO Quarto também é da clínica
      await this.validarQuarto(dto.quartoId, usuarioLogado.clinicaId);
    }

    // 4. Atualiza
    return this.prisma.leito.update({
      where: { id: id },
      data: dto, // O DTO já impede a mudança para 'OCUPADO'
    });
  }

  /**
   * REMOVER um Leito
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // 1. Valida se o leito é da clínica
    const leito = await this.getLeito(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: Não permite excluir se estiver ocupado
    if (leito.status === StatusLeito.OCUPADO) {
      throw new ConflictException(
        'Este leito não pode ser removido pois está OCUPADO.',
      );
    }
    
    // 3. Remove
    return this.prisma.leito.delete({
      where: { id: id },
    });
  }
}