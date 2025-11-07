// src/quartos/quartos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { QueryQuartoDto } from './dto/query-quarto.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class QuartosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper 1: Valida se o quarto existe e pertence à clínica
   */
  private async getQuarto(id: number, clinicaId: number) {
    const quarto = await this.prisma.quarto.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!quarto) {
      throw new NotFoundException('Quarto não encontrado nesta clínica.');
    }
    return quarto;
  }

  /**
   * Helper 2: Valida se a Ala (pai) existe e pertence à clínica
   */
  private async validarAla(alaId: number, clinicaId: number) {
    const ala = await this.prisma.ala.findFirst({
      where: { id: alaId, clinicaId: clinicaId },
    });
    if (!ala) {
      throw new NotFoundException('Ala não encontrada nesta clínica.');
    }
  }

  /**
   * CRIAR um novo Quarto
   */
  async create(dto: CreateQuartoDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Valida se a Ala-pai existe e é da mesma clínica
    await this.validarAla(dto.alaId, clinicaId);

    // 2. Cria o quarto
    return this.prisma.quarto.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao,
        alaId: dto.alaId,
        clinicaId: clinicaId, // Segurança
      },
    });
  }

  /**
   * LISTAR todos os Quartos (com filtro opcional por Ala)
   */
  async findAll(query: QueryQuartoDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;
    
    // Filtro base de segurança
    const where: Prisma.QuartoWhereInput = {
      clinicaId: clinicaId,
    };

    // Filtro opcional da query
    if (query.alaId) {
      where.alaId = query.alaId;
    }

    return this.prisma.quarto.findMany({
      where: where,
      include: {
        ala: { select: { nome: true } }, // Mostra o nome da Ala
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * BUSCAR UM Quarto
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // 1. Valida o quarto
    await this.getQuarto(id, usuarioLogado.clinicaId);
    
    // 2. Retorna com detalhes
    return this.prisma.quarto.findUnique({
      where: { id: id },
      include: { 
        ala: true, // Inclui a Ala inteira
      },
    });
  }

  /**
   * ATUALIZAR um Quarto
   */
  async update(id: number, dto: UpdateQuartoDto, usuarioLogado: Usuario) {
    // 1. Valida se o quarto é da clínica
    await this.getQuarto(id, usuarioLogado.clinicaId);

    // 2. Se o usuário está tentando MOVER o quarto (mudar o alaId)
    if (dto.alaId) {
      // Valida se a NOVA Ala também é da clínica
      await this.validarAla(dto.alaId, usuarioLogado.clinicaId);
    }

    // 3. Atualiza
    return this.prisma.quarto.update({
      where: { id: id },
      data: dto,
    });
  }

  /**
   * REMOVER um Quarto
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // 1. Valida se o quarto é da clínica
    await this.getQuarto(id, usuarioLogado.clinicaId);

    // 2. REGRA DE NEGÓCIO: Não permite excluir se houver leitos
    const leitos = await this.prisma.leito.count({
      where: { quartoId: id },
    });

    if (leitos > 0) {
      throw new ConflictException(
        'Este quarto não pode ser removido pois contém leitos vinculados.',
      );
    }
    
    // 3. Remove
    return this.prisma.quarto.delete({
      where: { id: id },
    });
  }
}