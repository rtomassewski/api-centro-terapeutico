import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProcedimentoDto } from './dto/create-procedimento.dto';
import { UpdateProcedimentoDto } from './dto/update-procedimento.dto';

@Injectable()
export class ProcedimentosService {
  constructor(private prisma: PrismaService) {}

  // Criar novo procedimento
  async create(createDto: CreateProcedimentoDto, clinicaId: number) {
    return this.prisma.procedimento.create({
      data: {
        ...createDto,
        clinicaId: clinicaId,
        ativo: createDto.ativo ?? true, // Padrão é ativo
      },
    });
  }

  // Listar todos da clínica (opcionalmente filtrar por apenas ativos)
  async findAll(clinicaId: number, apenasAtivos: boolean = false) {
    const where: any = { clinicaId };
    
    if (apenasAtivos) {
      where.ativo = true;
    }

    return this.prisma.procedimento.findMany({
      where,
      orderBy: { nome: 'asc' },
    });
  }

  // Buscar um específico (segurança: checa se pertence à clínica)
  async findOne(id: number, clinicaId: number) {
    const procedimento = await this.prisma.procedimento.findFirst({
      where: { id, clinicaId },
    });

    if (!procedimento) {
      throw new NotFoundException('Procedimento não encontrado.');
    }

    return procedimento;
  }

  // Atualizar
  async update(id: number, clinicaId: number, updateDto: UpdateProcedimentoDto) {
    // Verifica se existe antes
    await this.findOne(id, clinicaId);

    return this.prisma.procedimento.update({
      where: { id },
      data: updateDto,
    });
  }

  // Deletar (Cuidado: Se já tiver agendamentos vinculados, o banco pode bloquear. 
  // O ideal geralmente é apenas inativar com o update, mas deixo o delete aqui).
  async remove(id: number, clinicaId: number) {
    await this.findOne(id, clinicaId);

    try {
      return await this.prisma.procedimento.delete({
        where: { id },
      });
    } catch (error) {
      // Se houver registros vinculados (AgendamentoOnProcedimentos), dará erro
      throw new BadRequestException('Não é possível excluir este procedimento pois ele já está vinculado a agendamentos. Tente inativá-lo.');
    }
  }
}