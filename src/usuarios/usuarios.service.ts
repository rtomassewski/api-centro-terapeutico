// src/usuarios/usuarios.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; // (Vamos criar este DTO)
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Busca um usuário da clínica
   */
  private async getUsuario(id: number, clinicaId: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id: id, clinicaId: clinicaId },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        ativo: true,
        registro_conselho: true,
        papel: { select: { nome: true } }
      }
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado ou não pertence a esta clínica.');
    }
    return usuario;
  }

  /**
   * (CORRIGIDO) Criar um novo profissional
   */
  async create(dto: CreateUsuarioDto, usuarioLogado: Usuario) {
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(dto.senha, saltRounds);

    try {
      const usuario = await this.prisma.usuario.create({
        data: {
          nome_completo: dto.nome_completo,
          email: dto.email,
          senha_hash: senhaHash,
          registro_conselho: dto.registro_conselho,
          papelId: dto.papelId,
          ativo: true,
          clinicaId: usuarioLogado.clinicaId, // 1. CORREÇÃO: Pega do token
        },
        select: {
          id: true,
          nome_completo: true,
          email: true,
          ativo: true,
          papelId: true,
          createdAt: true,
        }
      });
      return usuario;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        if ((error.meta?.target as string[]).includes('email')) {
          throw new ConflictException('Este e-mail já está em uso.');
        }
      }
      throw error;
    }
  }

  /**
   * (CORRIGIDO) Listar profissionais da clínica
   */
  async findAll(usuarioLogado: Usuario) {
    return this.prisma.usuario.findMany({
      where: {
        clinicaId: usuarioLogado.clinicaId, // 2. CORREÇÃO: Filtra pela clínica
      },
      select: {
        id: true,
        nome_completo: true,
        email: true,
        ativo: true,
        papel: {
          select: { nome: true }
        }
      },
      orderBy: { nome_completo: 'asc' }
    });
  }

  /**
   * (NOVO) Buscar um profissional
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    return this.getUsuario(id, usuarioLogado.clinicaId);
  }

  /**
   * (NOVO) Atualizar um profissional
   */
  async update(id: number, dto: UpdateUsuarioDto, usuarioLogado: Usuario) {
    // 1. Garante que o usuário existe e pertence à clínica
    await this.getUsuario(id, usuarioLogado.clinicaId);
    
    // 2. Impede que o usuário se edite (se não for permitido)
    // if (id === usuarioLogado.id) {
    //   throw new ForbiddenException('Você não pode editar seu próprio perfil por esta rota.');
    // }

    return this.prisma.usuario.update({
      where: { id: id },
      data: dto,
      select: {
        id: true,
        nome_completo: true,
        email: true,
        ativo: true,
        papelId: true
      }
    });
  }

  /**
   * (NOVO) Desativar um profissional (Soft Delete)
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // 1. Garante que o usuário existe e pertence à clínica
    await this.getUsuario(id, usuarioLogado.clinicaId);

    // 2. Regra de negócio: Impede que um admin se desative
    if (id === usuarioLogado.id) {
      throw new ForbiddenException('Um administrador não pode desativar a si mesmo.');
    }

    // 3. Soft Delete: Apenas marca como inativo
    return this.prisma.usuario.update({
      where: { id: id },
      data: {
        ativo: false,
      },
    });
  }

  /**
   * (SEM MUDANÇAS) Usado pelo AuthService
   */
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {
        email: email,
      },
      include: {
        papel: true, // Inclui o papel
        clinica: { // Inclui a clínica do usuário
          include: {
            licenca: true, // E inclui a licença da clínica
          },
        },
      },
    });
  }
}